import { connectDB } from "./backend/utils/connect";
export async function register() {
    await connectDB()
}