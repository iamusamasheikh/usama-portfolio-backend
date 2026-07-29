<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Read raw JSON input or fallback to $_POST
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        $data = $_POST;
    }

    $name = isset($data['name']) ? htmlspecialchars(strip_tags(trim($data['name']))) : '';
    $email = isset($data['email']) ? filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL) : false;
    $phone = isset($data['phone']) ? htmlspecialchars(strip_tags(trim($data['phone']))) : 'N/A';
    $service = isset($data['service']) ? htmlspecialchars(strip_tags(trim($data['service']))) : 'General Inquiry';
    $budget = isset($data['budget']) ? htmlspecialchars(strip_tags(trim($data['budget']))) : 'N/A';
    $message = isset($data['message']) ? htmlspecialchars(strip_tags(trim($data['message']))) : 'N/A';
    $attachedEstimate = isset($data['attachedEstimate']) ? $data['attachedEstimate'] : null;

    if (empty($name) || !$email) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Please provide a valid Name and Email address."]);
        exit();
    }

    // -------------------------------------------------------------
    // 1. ADMIN NOTIFICATION EMAIL TO USAMA SHEIKH
    // -------------------------------------------------------------
    $adminTo = "officialusamano1@gmail.com, hello@usamasheikh.com";
    $adminSubject = "🚨 New Portfolio Lead Inquiry: " . $name . " (" . $service . ")";

    $estimateHtml = "";
    if ($attachedEstimate) {
        $cost = isset($attachedEstimate['calculatedCost']) ? $attachedEstimate['calculatedCost'] : 'N/A';
        $timeline = isset($attachedEstimate['calculatedTimeline']) ? $attachedEstimate['calculatedTimeline'] : 'N/A';
        $estimateHtml = "
        <hr style='border-color: rgba(255,255,255,0.1); margin: 15px 0;'>
        <h3 style='color: #fbbf24; margin: 0 0 10px 0;'>Attached Budget Estimator Details:</h3>
        <p style='margin: 4px 0;'><strong>Calculated Investment:</strong> " . $cost . "</p>
        <p style='margin: 4px 0;'><strong>Estimated Delivery:</strong> " . $timeline . "</p>
        ";
    }

    $adminBody = "
    <html>
    <head>
      <title>New Portfolio Lead Inquiry</title>
    </head>
    <body style='font-family: Arial, sans-serif; background-color: #090d16; color: #ffffff; padding: 20px;'>
      <div style='max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #10b981; border-radius: 12px; padding: 24px;'>
        <h2 style='color: #10b981; margin-top: 0; font-size: 20px;'>🚨 New Portfolio Client Inquiry Received!</h2>
        
        <table style='width: 100%; border-collapse: collapse; margin-top: 15px; color: #e2e8f0; font-size: 14px;'>
          <tr style='background: rgba(255,255,255,0.03);'>
            <td style='padding: 10px; border: 1px solid rgba(255,255,255,0.1); font-weight: bold; width: 140px;'>Client Name:</td>
            <td style='padding: 10px; border: 1px solid rgba(255,255,255,0.1);'>" . $name . "</td>
          </tr>
          <tr>
            <td style='padding: 10px; border: 1px solid rgba(255,255,255,0.1); font-weight: bold;'>Email Address:</td>
            <td style='padding: 10px; border: 1px solid rgba(255,255,255,0.1);'><a href='mailto:" . $email . "' style='color: #38bdf8;'>" . $email . "</a></td>
          </tr>
          <tr style='background: rgba(255,255,255,0.03);'>
            <td style='padding: 10px; border: 1px solid rgba(255,255,255,0.1); font-weight: bold;'>Phone / WhatsApp:</td>
            <td style='padding: 10px; border: 1px solid rgba(255,255,255,0.1);'>" . $phone . "</td>
          </tr>
          <tr>
            <td style='padding: 10px; border: 1px solid rgba(255,255,255,0.1); font-weight: bold;'>Selected Service:</td>
            <td style='padding: 10px; border: 1px solid rgba(255,255,255,0.1); color: #10b981; font-weight: bold;'>" . $service . "</td>
          </tr>
          <tr style='background: rgba(255,255,255,0.03);'>
            <td style='padding: 10px; border: 1px solid rgba(255,255,255,0.1); font-weight: bold;'>Estimated Budget:</td>
            <td style='padding: 10px; border: 1px solid rgba(255,255,255,0.1);'>" . $budget . "</td>
          </tr>
        </table>

        <div style='margin-top: 15px; padding: 12px; background: rgba(255,255,255,0.04); border-left: 4px solid #10b981; border-radius: 4px;'>
          <strong style='color: #94a3b8; font-size: 12px; text-transform: uppercase;'>Message / Project Goals:</strong>
          <p style='margin: 8px 0 0 0; color: #f8fafc; white-space: pre-wrap; font-size: 14px;'>" . nl2br($message) . "</p>
        </div>

        " . $estimateHtml . "

        <p style='font-size: 12px; color: #64748b; margin-top: 20px;'>Submitted Date: " . date("F j, Y, g:i a") . "</p>
      </div>
    </body>
    </html>
    ";

    $adminHeaders = "MIME-Version: 1.0" . "\r\n";
    $adminHeaders .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $adminHeaders .= "From: Usama Sheikh Portfolio <hello@usamasheikh.com>" . "\r\n";
    $adminHeaders .= "Reply-To: " . $name . " <" . $email . ">" . "\r\n";

    // Send Admin Email
    @mail($adminTo, $adminSubject, $adminBody, $adminHeaders);

    // -------------------------------------------------------------
    // 2. AUTOMATIC BRANDED CONFIRMATION EMAIL TO CLIENT
    // -------------------------------------------------------------
    $clientSubject = "Thank you for reaching out, " . $name . "! - Usama Sheikh";
    $clientBody = "
    <html>
    <head>
      <title>Thank you for reaching out</title>
    </head>
    <body style='font-family: Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px;'>
      <div style='max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);'>
        
        <div style='text-align: center; padding-bottom: 16px; border-bottom: 2px solid #10b981;'>
          <h2 style='color: #0f172a; margin: 0; font-size: 22px; letter-spacing: 1px;'>USAMA SHEIKH</h2>
          <p style='color: #10b981; font-weight: 700; font-size: 13px; margin-top: 4px; text-transform: uppercase;'>Digital Marketing Strategist & Full-Stack Web Developer</p>
        </div>

        <div style='padding: 20px 0;'>
          <h3 style='color: #0f172a; margin-top: 0;'>Hi " . $name . ",</h3>
          <p style='line-height: 1.6; color: #475569;'>Thank you for getting in touch regarding <strong>" . $service . "</strong>!</p>
          <p style='line-height: 1.6; color: #475569;'>I have received your inquiry and project details. I am currently reviewing your requirements and will get back to you within <strong>2 to 4 hours</strong> with a tailored strategy and quote.</p>
          
          <div style='background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;'>
            <p style='margin: 0; font-weight: 700; color: #065f46;'>Need an immediate response?</p>
            <p style='margin: 6px 0 0 0; color: #047857; font-size: 14px;'>Feel free to chat with me directly on WhatsApp: <a href='https://wa.me/923007856880' style='color: #059669; font-weight: 700; text-decoration: underline;'>+92 300 7856880</a></p>
          </div>
        </div>

        <div style='border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 13px; color: #64748b;'>
          <p style='margin: 0;'>Best regards,</p>
          <p style='margin: 4px 0 0 0; font-weight: 700; color: #0f172a;'>Usama Sheikh</p>
          <p style='margin: 2px 0 0 0;'>WordPress & Shopify Expert · Advanced Technical SEO</p>
          <p style='margin: 2px 0 0 0;'><a href='https://usamasheikh.com' style='color: #10b981; text-decoration: none;'>usamasheikh.com</a></p>
        </div>
      </div>
    </body>
    </html>
    ";

    $clientHeaders = "MIME-Version: 1.0" . "\r\n";
    $clientHeaders .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $clientHeaders .= "From: Usama Sheikh <hello@usamasheikh.com>" . "\r\n";
    $clientHeaders .= "Reply-To: Usama Sheikh <hello@usamasheikh.com>" . "\r\n";

    // Send Client Confirmation Email
    @mail($email, $clientSubject, $clientBody, $clientHeaders);

    // Return Success Response
    echo json_encode([
        "success" => true,
        "message" => "Thank you! Your message has been sent successfully."
    ]);
    exit();

} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
}
?>
