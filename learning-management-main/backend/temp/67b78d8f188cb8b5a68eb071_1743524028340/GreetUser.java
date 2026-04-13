import java.util.Scanner;  // Import the Scanner class

public class GreetUser {
    public static void main(String[] args) {
        // Create a Scanner object for user input
        Scanner scanner = new Scanner(System.in);

        // Ask for the user's name
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();  // Read user input

        // Print a personalized greeting
        System.out.println("Hello, " + name + "! Welcome to Java programming.");

        // Close the scanner
        scanner.close();
    }
}
