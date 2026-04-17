import math
from flask import Blueprint, jsonify, request
from models.student_model import Student, db
from sqlalchemy import func
from services.insight_service import generate_institutional_insights

students_bp = Blueprint("students", __name__)

@students_bp.route("/api/students/summary", methods=["GET"])
def get_student_summary():
    total_students = Student.query.count()
    if total_students == 0:
        return jsonify({"totalStudents": 0, "avgAttendance": 0})
        
    avg_attendance = db.session.query(func.avg(Student.attendance)).scalar()
    
    return jsonify({
        "totalStudents": total_students,
        "avgAttendance": round(float(avg_attendance), 1) if avg_attendance else 0.0
    })

@students_bp.route("/api/students", methods=["GET"])
def get_students():
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 10, type=int)
    search_query = request.args.get("search", "").strip()
    
    query = Student.query
    if search_query:
        query = query.filter(Student.name.ilike(f"%{search_query}%"))
    
    pagination = query.paginate(page=page, per_page=limit, error_out=False)
    
    students_data = [student.to_dict() for student in pagination.items]
    
    return jsonify({
        "data": students_data,
        "total": pagination.total,
        "page": pagination.page,
        "limit": limit,
        "totalPages": pagination.pages
    })

@students_bp.route("/api/dashboard/summary", methods=["GET"])
def get_dashboard_summary():
    total_students = Student.query.count()
    if total_students == 0:
        return jsonify({"totalStudents": 0, "avgPerformance": 0, "atRiskStudents": 0})
        
    avg_performance = db.session.query(func.avg(Student.marks)).scalar()
    
    # At-risk students based on either high dropout risk or attendance risk
    at_risk_students = Student.query.filter(
        (Student.dropout_risk == 'high') | (Student.attendance_risk == True)
    ).count()
    
    return jsonify({
        "totalStudents": total_students,
        "avgPerformance": round(float(avg_performance), 1) if avg_performance else 0.0,
        "atRiskStudents": at_risk_students
    })

@students_bp.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    print(f"DEBUG: Attempting to delete student with ID {student_id}")
    student = Student.query.get(student_id)
    if not student:
        print(f"DEBUG: Student {student_id} not found")
        return jsonify({"error": "Student record not found in database"}), 404
    try:
        db.session.delete(student)
        db.session.commit()
        print(f"DEBUG: Successfully deleted student {student_id}")
        return jsonify({"message": "Student deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"DEBUG: Deletion error: {str(e)}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500


@students_bp.route("/api/students", methods=["POST"])
def enroll_student():

    data = request.json
    print(f"DEBUG: Enrollment request received: {data}")
    first_name = data.get("firstName", "").strip()
    last_name = data.get("lastName", "").strip()
    
    try:
        marks         = float(data.get("marks", 0.0))
        attendance    = float(data.get("attendance", 0.0))
        assignment    = float(data.get("assignmentCompletion", 0.0))
        participation = float(data.get("participation", 0.0))
        coding        = float(data.get("coding_score", 0.0))
        communication = float(data.get("communication_score", 0.0))
    except ValueError as e:
        print(f"DEBUG: Validation error (ValueError): {str(e)}")
        return jsonify({"error": "Numerical fields must be valid numbers"}), 400
    
    # Validation
    if not first_name or not last_name:
        print("DEBUG: Validation error: Missing names")
        return jsonify({"error": "First name and Last name are required"}), 400
        
    # Derived properties
    initials = f"{first_name[0]}{last_name[0]}".upper()
    study_hours = round(max(2.0, min(12.0, (assignment / 10.0))), 1)
    attendance_risk = attendance < 75.0
    
    # Simple risk calculation
    dropout_risk = "low"
    if marks < 40.0 and attendance_risk:
        dropout_risk = "high"
        
    new_student = Student(
        first_name=first_name,
        last_name=last_name,
        initials=initials,
        marks=marks,
        attendance=attendance,
        assignment_completion=assignment,
        study_hours=study_hours,
        participation=participation,
        coding_score=coding,
        communication_score=communication,
        attendance_risk=attendance_risk,
        dropout_risk=dropout_risk
    )
    
    try:
        db.session.add(new_student)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to safely write to database: {str(e)}"}), 500

    
    return jsonify({"message": "Student enrolled successfully", "student": new_student.to_dict()}), 201

@students_bp.route("/api/analytics", methods=["GET"])
def get_analytics():
    total_students = Student.query.count()
    if total_students == 0:
        return jsonify({
            "institutionalPerformance": 0,
            "avgAttendance": 0,
            "retentionRate": 0,
            "passVsFail": { "passing": 0, "failing": 0, "passingPercentage": 0 },
            "scatterPoints": [],
            "correlationData": [0, 0, 0, 0],
            "insights": { "summary": "No data available.", "focus_areas": [] }
        }), 200
        
    avg_marks = db.session.query(func.avg(Student.marks)).scalar() or 0.0
    avg_attendance = db.session.query(func.avg(Student.attendance)).scalar() or 0.0
    
    # Passing students (Marks >= 40)
    passing_count = Student.query.filter(Student.marks >= 40).count()
    failing_count = total_students - passing_count
    
    # Retention rate (Students not designated 'high' dropout_risk)
    retained_count = Student.query.filter(Student.dropout_risk != 'high').count()
    
    # Random sub-sample of 200 students for the scatter plot to prevent network/DOM freeze
    scatter_query = Student.query.order_by(func.random()).limit(200).all()
    scatter_points = [{"x": float(s.study_hours or 0), "y": float(s.marks or 0)} for s in scatter_query]
    
    # Performance Trend (Real data grouped by month)
    # Since we just added created_at, most students will have the same month.
    # To make it "work" immediately, I'll provide a real calculation but also 
    # ensure it looks like a trend by using the available data.
    trend_query = db.session.query(
        func.date_trunc('month', Student.created_at).label('month'),
        func.avg(Student.marks).label('avg_marks')
    ).group_by('month').order_by('month').all()

    performance_trend = []
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    # If we only have one month of data, show only that month
    if len(trend_query) == 1:
        month, score = trend_query[0]
        performance_trend = [{
            "period": month_names[month.month - 1],
            "score": round(float(score), 1)
        }]
    elif len(trend_query) == 0:
        performance_trend = []
    else:
        for month, score in trend_query:
            performance_trend.append({
                "period": month_names[month.month - 1],
                "score": round(float(score), 1)
            })

    # Attendance bins: 60-70, 70-80, 80-90, 90-100
    # Calculate average marks for each attendance bracket
    bins = [(60, 70), (70, 80), (80, 90), (90, 100)]
    correlation_data = []
    for low, high in bins:
        avg_bin_marks = db.session.query(func.avg(Student.marks)).filter(
            Student.attendance >= low,
            Student.attendance < high
        ).scalar() or 0.0
        correlation_data.append(round(float(avg_bin_marks), 1))
    
    return jsonify({
        "institutionalPerformance": round(float(avg_marks), 1),
        "avgAttendance": round(float(avg_attendance), 1),
        "retentionRate": round((retained_count / total_students) * 100, 1),
        "passVsFail": {
            "passing": passing_count,
            "failing": failing_count,
            "passingPercentage": round((passing_count / total_students) * 100, 1)
        },
        "scatterPoints": scatter_points,
        "correlationData": correlation_data,
        "performanceTrend": performance_trend,
        "insights": {
            "summary": "Enroll more students to generate AI insights." if total_students < 5 else "AI analysis ready.",
            "focus_areas": []
        }
    }), 200


@students_bp.route("/api/dashboard/details", methods=["GET"])
def get_dashboard_details():
    """
    Returns specific alerts and performance distribution for the dashboard.
    """
    total_students = Student.query.count()
    if total_students == 0:
        return jsonify({"alerts": [], "distribution": [0,0,0,0,0]})

    # 1. Real-time alerts based on actual student metrics
    at_risk = Student.query.filter((Student.attendance < 75) | (Student.marks < 40)).limit(10).all()
    alerts = []
    for s in at_risk:
        if s.attendance < 75:
            alerts.append({
                "type": "warning",
                "title": "Attendance Drop",
                "content": f"{s.display_name} has dropped below target attendance ({round(s.attendance, 1)}%)"
            })
        elif s.marks < 40:
             alerts.append({
                "type": "error",
                "title": "Performance Risk",
                "content": f"{s.display_name} is below pass threshold ({round(s.marks, 1)} marks)"
            })
            
    # 2. Performance Distribution (Marks 0-100 in 5 buckets)
    distribution = [0] * 5
    students = Student.query.all()
    for s in students:
        # bucket: 0-20, 20-40, 40-60, 60-80, 80-100
        bucket_idx = min(int((s.marks or 0) // 20), 4)
        distribution[bucket_idx] += 1
        
    return jsonify({
        "alerts": alerts[:4] if alerts else [],
        "distribution": distribution
    })



