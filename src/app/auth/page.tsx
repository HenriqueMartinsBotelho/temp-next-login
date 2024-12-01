"use client";

import { cn } from "@/app/lib/utils";
import { Icons } from "@/app/components/icons";
import { Button } from "@/app/components/button";
import { Input } from "@/app/components/input";
import { Label } from "@/app/components/label";
import Image from "next/image";
import { useState, useCallback } from "react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

const FormError = ({ message, id }: { message: string; id?: string }) => (
  <p
    className="text-red-500 text-sm mt-1"
    role="alert"
    aria-live="polite"
    id={id}
  >
    {message}
  </p>
);

const useFormValidation = (initialState = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>(
    initialState
  );

  const validateForm = useCallback((data: unknown) => {
    try {
      return loginSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
        setFormErrors(errors);
      }
      return null;
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormErrors({});
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    setIsLoading,
    formErrors,
    validateForm,
    resetForm,
  };
};

const authService = {
  login: async (email: string, password: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(email === "test@example.com" && password === "password123");
      }, 1500);
    });
  },
};

export default function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isLoading, setIsLoading, formErrors, validateForm, resetForm } =
    useFormValidation();

  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = validateForm(data);

    if (validatedData) {
      try {
        const success = await authService.login(data.email, data.password);

        if (success) {
          console.log("Login bem-sucedido");
        } else {
          setLoginError("Credenciais inválidas");
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        setLoginError("Erro de autenticação. Tente novamente.");
      } finally {
        resetForm();
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-[#2779c3] p-6",
        className
      )}
      {...props}
    >
      <div className="relative flex flex-col items-center w-full max-w-md">
        <Image
          src="/logo-sos.svg"
          width={400}
          height={400}
          alt="Logo SOS"
          className="absolute -top-20 transform -translate-y-1/3 h-auto transition-transform duration-500 hover:rotate-3 hover:scale-110 hover:skew-y-3 swing"
        />
        <div className="w-full rounded-lg bg-white shadow-lg p-6">
          <h2
            className="text-xl font-semibold text-center text-gray-800"
            id="login-title"
          >
            Entrar
          </h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            com sua Rede Social
          </p>

          {loginError && (
            <div
              role="alert"
              aria-live="assertive"
              className="bg-red-50 border border-red-200 text-red-600 p-3 rounded mb-4"
            >
              {loginError}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              aria-label="Login com Google"
              className="w-full bg-white text-black border-gray-300 hover:border-gray-400 hover:text-gray-800"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              GOOGLE
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              aria-label="Login com Apple"
              className="w-full border-gray-300 text-white hover:border-gray-400 hover:text-gray-800"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.apple className="mr-2 h-4 w-4" />
              )}
              APPLE
            </Button>
          </div>

          <div className="my-4 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <form onSubmit={onSubmit} aria-labelledby="login-title">
            <div className="grid gap-4">
              <div className="flex flex-col">
                <Label
                  className="text-black mb-2 font-semibold"
                  htmlFor="email"
                >
                  Email / CPF
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  aria-required="true"
                  aria-invalid={!!formErrors.email}
                  aria-describedby="email-error"
                  className="w-full text-black"
                />
                {formErrors.email && (
                  <FormError message={formErrors.email} id="email-error" />
                )}
              </div>
              <div className="flex flex-col">
                <Label
                  className="text-black mb-2 font-semibold"
                  htmlFor="password"
                >
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  autoCorrect="off"
                  disabled={isLoading}
                  aria-required="true"
                  aria-invalid={!!formErrors.password}
                  aria-describedby="password-error"
                  className="w-full text-black"
                />
                {formErrors.password && (
                  <FormError
                    message={formErrors.password}
                    id="password-error"
                  />
                )}
              </div>
            </div>

            <div className="my-6">
              <div className="flex text-xs">
                <a
                  href="#"
                  className="bg-white font-semibold text-[#3a89ce] hover:underline"
                  aria-label="Recuperar senha"
                >
                  Esqueci minha senha
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
