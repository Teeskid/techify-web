import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom'

import './App.css'

import SignIn from './routes/auth/sign-in'
import SignUp from './routes/auth/sign-up'
import Privacy from './routes/misc/privacy'
import Root from './routes/root'

const routes: RouteObject[] = [
	{
		path: "/",
		Component: Root
	},
	{
		path: "/sign-in",
		Component: SignIn
	},
	{
		path: "/sign-up",
		Component: SignUp
	},
	{
		path: "privacy-policy",
		Component: Privacy
	}
]

function App() {
	return (
		<>
			<RouterProvider router={createBrowserRouter(routes)} />
		</>
	)
}

export default App
