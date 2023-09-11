import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import EmailService from "../services/EmailService";

export class UserController {

    private userRepository = AppDataSource.getRepository(User);
    private emailService = new EmailService();

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    async registerAndNotify(request: Request, response: Response, next: NextFunction) {
        try {
            const { name, email } = request.body;

            const user = Object.assign(new User(), {
                name,
                email
            })
            
            // Check if the user already exists
            const existingUser = await this.userRepository.findOne({
                where: { email: email }
            })

            if (existingUser) {
                response.status(200).json({ userId: existingUser.id });
            } else {
                // Insert user into the database
                const newUser = this.userRepository.create(user);
                await this.userRepository.save(newUser);
 
                // Send a welcome email using the EmailService
                await this.emailService.sendWelcomeEmail(newUser.email, newUser.name);

                // Return user id
                response.status(201).json({ userId: newUser.id });
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }
}