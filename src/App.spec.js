import App from './App';
import { render, screen } from './test/setup';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';

const setup = (path) => {
    window.history.pushState({}, '', path);
    render(<App />);
  };

  const server = setupServer(
    rest.post('/api/1.0/users/token/:token', (req, res, ctx) => {
      return res(ctx.status(200));
    }),
    rest.get('/api/1.0/users', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          content: [
            {
              id: 1,
              username: 'user-in-list',
              email: 'user-in-list@mail.com',
              image: null
            }
          ],
          page: 0,
          size: 0,
          totalPages: 0
        })
      );
    }),
  )

describe('Routing', () => {
    it.each`
    path               | pageTestId
    ${'/'}             | ${'home-page'}
    ${'/signup'}       | ${'signup-page'}
    ${'/login'}        | ${'login-page'}
    ${'/user/1'}       | ${'user-page'}
    ${'/user/2'}       | ${'user-page'}
    ${'/activate/123'} | ${'activation-page'}
    ${'/activate/456'} | ${'activation-page'}
  `('displays $pageTestId when path is $path', ({ path, pageTestId }) => {
    setup(path);
    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
    path               | pageTestId
    ${'/'}             | ${'signup-page'}
    ${'/'}             | ${'login-page'}
    ${'/'}             | ${'user-page'}
    ${'/'}             | ${'activation-page'}
    ${'/signup'}       | ${'home-page'}
    ${'/signup'}       | ${'login-page'}
    ${'/signup'}       | ${'user-page'}
    ${'/signup'}       | ${'activation-page'}
    ${'/login'}        | ${'home-page'}
    ${'/login'}        | ${'signup-page'}
    ${'/login'}        | ${'user-page'}
    ${'/login'}        | ${'activation-page'}
    ${'/user/1'}       | ${'home-page'}
    ${'/user/1'}       | ${'signup-page'}
    ${'/user/1'}       | ${'login-page'}
    ${'/user/1'}       | ${'activation-page'}
    ${'/activate/123'} | ${'home-page'}
    ${'/activate/123'} | ${'signup-page'}
    ${'/activate/123'} | ${'login-page'}
    ${'/activate/123'} | ${'user-page'}
  `(
    'does not display $pageTestId when path is $path',
    ({ path, pageTestId }) => {
      setup(path);
      const page = screen.queryByTestId(pageTestId);
      expect(page).not.toBeInTheDocument();
    }
  );

  it('displays home page when clicking brand logo', () => {
    setup('/login');
    const logo = screen.queryByAltText('Hoaxify');
    userEvent.click(logo);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('navigates to user page when clicking the username on user list', async () => {
    setup('/');
    const user = await screen.findByText('user-in-list');
    userEvent.click(user);
    const page = await screen.findByTestId('user-page');
    expect(page).toBeInTheDocument();
  });

  describe('Login', () => {
    const setupLoggedIn = () => {
      setup('/login');
      userEvent.type(screen.getByLabelText('E-mail'), 'user5@mail.com');
      userEvent.type(screen.getByLabelText('Password'), 'P4ssword');
      userEvent.click(screen.getByRole('button', { name: 'Login' }));
    };
  
    it('redirects to homepage after successful login', async () => {
      setupLoggedIn();
      const page = await screen.findByTestId('home-page');
      expect(page).toBeInTheDocument();
    });
  });
});
