import SignUpPage from "./SignUpPage";
import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import useEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import "../locale/i18n";
import en from '../locale/en.json';
import tr from '../locale/tr.json';


describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<SignUpPage />);
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });
    it("has username input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });
    it("has email input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Email");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has password type for password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });
    it("has Sign Up button", () => {
      render(<SignUpPage />);
      const button = screen.getByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });
    it("disables the button initially", () => {
      render(<SignUpPage />);
      const button = screen.getByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });
  describe("Interractions", () => {
    let turkishToggle, passwordInput, passwordRepeatInput;;
    let button;
    let counter = 0;
    let acceptLanguageHeader;
    const server = setupServer(
      rest.post("/api/1.0/users", (req, res, ctx) => {
        counter += 1;
        return res(ctx.status(200));
      })
    );

    beforeEach(() => {
      counter = 0;
      server.resetHandlers();
    })

    beforeAll(() => server.listen());

    afterAll(() => server.close());
    
    const setup = () => {
      render(<SignUpPage />);
      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Password Repeat");
      useEvent.type(usernameInput, "user1");
      useEvent.type(emailInput, "user1@mail.com");
      useEvent.type(passwordInput, "P4ssword");
      useEvent.type(passwordRepeatInput, "P4ssword");
      button = screen.queryByRole("button", { name: "Sign Up" });
    };

    it("enables the button when password and password repeat fields have same value", () => {
      setup();
      expect(button).toBeEnabled();
    });
    it("display account activation noticfication afer successful sign up request", async () => {
      setup();
      const msg = "Please check you e-email to active your account";
      expect(screen.queryByText(msg)).not.toBeInTheDocument();
      useEvent.click(button);
      const text = await screen.findByText(msg);
      expect(text).toBeInTheDocument();
    });
    it("hides sign up form after successful sign up request", async () => {
      setup();
      const form = screen.getByTestId("form-sign-up");
      useEvent.click(button);
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      })
    })
    const generateValidationError = (field, message) => {
      return rest.post('/api/1.0/users', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: { [field]: message }
          })
        );
      });
    };
    it('hides spinner and enables button after response received', async () => {
      server.use(
        generateValidationError('username', 'Username cannot be null')
      );
      setup();
      useEvent.click(button);
      await screen.findByText('Username cannot be null');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    });
    it('displays all text in Turkish after changing the language', () => {
      setup();
      useEvent.click(turkishToggle);
      expect(
        screen.getByRole('heading', { name: tr.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: tr.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(tr.username)).toBeInTheDocument();
      expect(screen.getByLabelText(tr.email)).toBeInTheDocument();
      expect(screen.getByLabelText(tr.password)).toBeInTheDocument();
      expect(screen.getByLabelText(tr.passwordRepeat)).toBeInTheDocument();
    });
    it('displays mismatch message for password repeat input', () => {
      setup();
      useEvent.type(passwordInput, 'P4ssword');
      useEvent.type(passwordRepeatInput, 'AnotherP4ssword');
      const validationError = screen.queryByText('Password mismatch');
      expect(validationError).toBeInTheDocument();
    });
    it('sends accept language header as en for outgoing request', async () => {
      setup();
      useEvent.type(passwordInput, 'P4ssword');
      useEvent.type(passwordRepeatInput, 'P4ssword');
      const button = screen.getByRole('button', { name: en.signUp });
      const form = screen.queryByTestId('form-sign-up');
      useEvent.click(button);
      await waitForElementToBeRemoved(form);
      expect(acceptLanguageHeader).toBe('en');
    });
  });
});

