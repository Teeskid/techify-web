import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom'

import './App.css'

import Privacy from './routes/pages/privacy'
import Root from './routes/root'

const routes: RouteObject[] = [
	{
		path: "/",
		Component: Root
	},
	{
		path: "privacy-policy",
		Component: Privacy
	}
]

function App() {
	return (
		<div>
			<h1>Techify Systems</h1>
			<RouterProvider router={createBrowserRouter(routes)} />
			
		</div>
	)
}

export default App
