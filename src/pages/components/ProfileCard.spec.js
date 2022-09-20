import ProfileCard from './ProfileCard';
import { render, screen } from '../test/setup';
import storage from '../state/storage';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

let count, id, requestBody, header;
const server = setupServer(
  rest.put('/api/1.0/users/:id', (req, res, ctx) => {
    count += 1;
    id = req.params.id;
    requestBody = req.body;
    header = req.headers.get('Authorization');
    return res(ctx.status(200));
  }),
  rest.delete('/api/1.0/users/:id', (req, res, ctx) => {
    id = req.params.id;
    header = req.headers.get('Authorization');
    return res(ctx.status(200));
  })
);

beforeEach(() => {
  count = 0;
  id = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

describe('Profile Card', () => {
  const setup = (user = { id: 5, username: 'user5' }) => {
    storage.setItem('auth', {
      id: 5,
      username: 'user5',
      header: 'auth header value'
    });
    render(<ProfileCard user={user} />);
  };

  let saveButton;
  const setupInEditMode = () => {
    setup();
    userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    saveButton = screen.getByRole('button', { name: 'Save' });
  };

  it('displays edit button when logged in user is shown on card', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });
  it('does not display edit button for another user', () => {
    setup({ id: 2, username: 'user2' });
    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });
});