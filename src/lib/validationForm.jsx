import { z } from "zod";

// Schema per registrazione
export const registerSchema = z.object({
  email: z.string().email("Email non valida"),
  firstName: z.string().min(1, "Inserisci il nome"),
  lastName: z.string().min(1, "Inserisci il cognome"),
  username: z.string().min(1, "Inserisci lo username"),
  password: z.string().min(6, "La password deve essere almeno 6 caratteri"),
});

// Schema per login
export const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(6, "La password deve essere almeno 6 caratteri"),
});

// Funzione sicura per estrarre errori da Zod
export function getZodErrors(error) {
  const errors = {};
  if (error && Array.isArray(error.issues)) {
    error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
  }
  return errors;
}
