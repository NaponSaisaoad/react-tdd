import { render, screen } from '../test/setup';
import LoginPage from './LoginPage';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

let requestBody,
  acceptLanguageHeader,
  count = 0;
const server = setupServer(
  rest.post('/api/1.0/auth', (req, res, ctx) => {
    requestBody = req.body;
    count += 1;
    acceptLanguageHeader = req.headers.get('Accept-Language');
    return res(ctx.status(401), ctx.json({ message: 'Incorrect credentials' }));
  })
);

beforeEach(() => {
  count = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

const loginSuccess = rest.post('/api/1.0/auth', (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      id: 5,
      username: 'user5',
      image: null,
      token: 'abcdefgh'
    })
  );
});

describe('Login Page', () => {
  describe('Layout', () => {
    it('has header', () => {
      render(<LoginPage />);
      const header = screen.queryByRole('heading', { name: 'Login' });
      expect(header).toBeInTheDocument();
    });
    it('has email input', () => {
      render(<LoginPage />);
      const input = screen.getByLabelText('E-mail');
      expect(input).toBeInTheDocument();
    });
    it('has password input', () => {
      render(<LoginPage />);
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    });
    it('has password type for password input', () => {
      render(<LoginPage />);
      const input = screen.getByLabelText('Password');
      expect(input.type).toBe('password');
    });
    it('has Login button', () => {
      render(<LoginPage />);
      const button = screen.queryByRole('button', { name: 'Login' });
      expect(button).toBeInTheDocument();
    });
    it('disables the button initially', () => {
      render(<LoginPage />);
      const button = screen.queryByRole('button', { name: 'Login' });
      expect(button).toBeDisabled();
    });
  });
  describe('Interactions', () => {
    let button, emailInput, passwordInput;
    const setup = (email = 'user100@mail.com') => {
      render(<LoginPage />);
      emailInput = screen.getByLabelText('E-mail');
      passwordInput = screen.getByLabelText('Password');
      userEvent.type(emailInput, email);
      userEvent.type(passwordInput, 'P4ssword');
      button = screen.queryByRole('button', { name: 'Login' });
    };

    it('enables the button when email and password inputs are filled', () => {
      setup();
      expect(button).toBeEnabled();
    });

  });
});