class EmailService {
    async sendWelcomeEmail(email: string, name: string): Promise<void> {
        // Simplified email sending logic, you can replace it with your email provider integration
        console.log(`Welcome to Leadtech! Hello ${name} thanks for registering on our site`);
        // Add your email sending logic here
    }
}

export default EmailService;
