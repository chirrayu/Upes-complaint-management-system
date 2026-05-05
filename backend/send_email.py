import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import config

# Configuration
SENDER_EMAIL = config.SENDER_EMAIL
APP_PASSWORD = config.APP_PASSWORD

def send_email(to_email, subject, body_text, body_html=None):
    """Base utility function to send an email with both plain text and HTML."""
    message = MIMEMultipart("alternative")
    message["From"] = f"UPES Support <{SENDER_EMAIL}>"
    message["To"] = to_email
    message["Subject"] = subject
    message["Reply-To"] = SENDER_EMAIL
    
    import time
    message["Message-ID"] = f"<{int(time.time())}@{SENDER_EMAIL.split('@')[1]}>"
    
    # Attach plain text (fallback for older clients)
    message.attach(MIMEText(body_text, "plain"))
    
    # Attach HTML if provided (makes the email look much nicer) # rivjr
    if body_html:
        message.attach(MIMEText(body_html, "html"))
        
    try:
        print(f"[DEBUG] Connecting to SMTP server for {to_email}...")
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, message.as_string())
        print(f"[SUCCESS] Email successfully sent to {to_email} (Subject: {subject})")
    except Exception as e:
        print(f"[ERROR] Failed to send email to {to_email}. Error type: {type(e).__name__}, Error: {e}")
    finally:
        try:
            server.quit()
        except:
            pass

# TEMPLATE FUNCTIONS (rate limit is the problem so won't be able to sne)

def send_complaint_submitted(to_email, student_name, complaint_id, title):
    """1. Complaint Submitted - Sent to Student"""
    subject = f"We heard you - Complaint #{complaint_id} Submitted"
    text = f"Hi {student_name},\n\nWe heard you. Your complaint '{title}' (ID: {complaint_id}) has been successfully submitted.\n\nThank you."
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2563eb;">We heard you. 📨</h2>
        <p>Hi <b>{student_name}</b>,</p>
        <p>Your complaint has been successfully registered in our system. Here are the details:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            <p style="margin: 0;"><b>Complaint ID:</b> {complaint_id}</p>
            <p style="margin: 5px 0 0 0;"><b>Subject:</b> {title}</p>
        </div>
        <p>We will review it and get back to you shortly.</p>
    </div>
    """
    send_email(to_email, subject, text, html)

def send_complaint_received(to_email, student_name, complaint_id):
    """2. Complaint Received (Admin Acknowledgement) - Sent to Student"""
    subject = f"A human is now aware - Complaint #{complaint_id}"
    text = f"Hi {student_name},\n\nA human is now aware. Your complaint #{complaint_id} has been acknowledged by our administration team."
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #d97706;">A human is now aware. 📥</h2>
        <p>Hi <b>{student_name}</b>,</p>
        <p>We wanted to let you know that our administration team has officially reviewed and acknowledged your complaint (<b>ID: {complaint_id}</b>).</p>
        <p>It will be assigned to the appropriate staff member shortly.</p>
    </div>
    """
    send_email(to_email, subject, text, html)

def send_complaint_assigned(staff_email, staff_name, complaint_id, student_email=None, student_name=None):
    """3. Complaint Assigned - Sent to Staff & optionally to Student"""
    
    # Email to Staff
    subject_staff = f"Action Required: Complaint #{complaint_id} Assigned to You"
    text_staff = f"Hi {staff_name},\n\nSomeone is now responsible. You have been assigned to handle complaint #{complaint_id}."
    html_staff = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #dc2626;">Someone is now responsible. 🛠️</h2>
        <p>Hi <b>{staff_name}</b>,</p>
        <p>You have been assigned to handle <b>Complaint #{complaint_id}</b>. Please log into the dashboard to review the details and begin taking action.</p>
    </div>
    """
    send_email(staff_email, subject_staff, text_staff, html_staff)
    
    # Email to Student (Optional)
    if student_email and student_name:
        subject_student = f"Your Complaint #{complaint_id} has been Assigned"
        text_student = f"Hi {student_name},\n\nSomeone is now responsible. Complaint #{complaint_id} has been assigned to a staff member ({staff_name}) and they are looking into it."
        html_student = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #059669;">Someone is now responsible. 🛠️</h2>
            <p>Hi <b>{student_name}</b>,</p>
            <p>Great news! Your complaint (<b>ID: {complaint_id}</b>) has been assigned to our staff member, <b>{staff_name}</b>.</p>
            <p>They will be looking into your issue and updating you on the progress.</p>
        </div>
        """
        send_email(student_email, subject_student, text_student, html_student)

def send_status_updated(to_email, student_name, complaint_id, old_status, new_status):
    """4. Status Updated - Sent to Student"""
    subject = f"Update on Complaint #{complaint_id}"
    text = f"Hi {student_name},\n\nYour problem is moving. The status of complaint #{complaint_id} has changed from '{old_status}' to '{new_status}'."
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #4f46e5;">Your problem is moving. 🔄</h2>
        <p>Hi <b>{student_name}</b>,</p>
        <p>The status of your complaint (<b>ID: {complaint_id}</b>) has been updated.</p>
        <div style="background-color: #eef2ff; padding: 15px; border-radius: 5px; text-align: center; font-size: 16px;">
            <span style="color: #6b7280; text-decoration: line-through;">{old_status}</span> 
            ➔ 
            <b style="color: #4f46e5;">{new_status}</b>
        </div>
    </div>
    """
    send_email(to_email, subject, text, html)

def send_staff_comment(to_email, student_name, complaint_id, comment):
    """5. Staff Comment / Update - Sent to Student"""
    subject = f"New Comment on Complaint #{complaint_id}"
    text = f"Hi {student_name},\n\nHere’s what’s happening. A new comment was added to your complaint #{complaint_id}:\n\n\"{comment}\""
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #0284c7;">Here’s what’s happening. 💬</h2>
        <p>Hi <b>{student_name}</b>,</p>
        <p>A staff member has left an update regarding your complaint (<b>ID: {complaint_id}</b>):</p>
        <blockquote style="border-left: 4px solid #0284c7; background-color: #f0f9ff; padding: 15px; margin-left: 0; font-style: italic; border-radius: 0 5px 5px 0;">
            "{comment}"
        </blockquote>
    </div>
    """
    send_email(to_email, subject, text, html)

def send_complaint_resolved(to_email, student_name, complaint_id):
    """6. Complaint Resolved - Sent to Student"""
    subject = f"Resolved - Complaint #{complaint_id}"
    text = f"Hi {student_name},\n\nIt’s done. Hopefully. Your complaint #{complaint_id} has been marked as resolved."
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #16a34a;">It’s done. Hopefully. ✅</h2>
        <p>Hi <b>{student_name}</b>,</p>
        <p>Your complaint (<b>ID: {complaint_id}</b>) has been officially marked as <b>Resolved</b>.</p>
        <p>If you are still facing issues, please feel free to reopen it or submit a new ticket. We hope the resolution was satisfactory!</p>
    </div>
    """
    send_email(to_email, subject, text, html)

if __name__ == "__main__":
    # Test Data using your email
    test_email = SENDER_EMAIL
    
    print("--- Running Tests ---")
    send_complaint_submitted(test_email, "John Student", "CMP-1024", "Projector not working in Room 101")
    send_complaint_received(test_email, "John Student", "CMP-1024")
    send_complaint_assigned(test_email, "Mr. Technician", "CMP-1024", test_email, "John Student")
    send_status_updated(test_email, "John Student", "CMP-1024", "Pending", "In Progress")
    send_staff_comment(test_email, "John Student", "CMP-1024", "We have dispatched someone with a replacement bulb.")
    send_complaint_resolved(test_email, "John Student", "CMP-1024")
