import { doc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { COURSES } from "../data/courses";

export const seedCourses = async () => {
    console.log("Starting course seeding...");
    const batch = writeBatch(db);

    try {
        for (const course of COURSES) {
            const courseRef = doc(db, "courses", course.id);
            batch.set(courseRef, course);
            console.log(`Prepared course: ${course.title}`);
        }

        await batch.commit();
        console.log("Seeding completed successfully!");
        return { success: true, count: COURSES.length };
    } catch (error) {
        console.error("Error seeding courses:", error);
        return { success: false, error: error.message };
    }
};
