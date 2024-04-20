import './App.css';

import { CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAnalytics, getGoogleAnalyticsClientId } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { isSupported } from "firebase/messaging";

import { AuthProvider } from './contexts';
import SignIn from './routes/auth/sign-in';
import SignUp from './routes/auth/sign-up';
import Home from './routes/home';
import AppDashboard from './routes/home/app/dashboard';
import AppSettings from './routes/home/app/settings';
import IDVHome from './routes/home/idv/home';
import IDVHomeRoot from './routes/home/idv/root';
import HomeRoot from './routes/home/root';
import SIMHomeRoot from './routes/home/sim/root';
import VTUHomeRoot from './routes/home/vtu/root';
import Privacy from './routes/misc/privacy';
import Root from './routes/root';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDwMERWGhJ2SI51pVqmBDMADkgUM2vdWlA",
	authDomain: "techify-ng.firebaseapp.com",
	databaseURL: "https://techify-ng.firebaseio.com",
	projectId: "techify-ng",
	storageBucket: "techify-ng.appspot.com",
	messagingSenderId: "25233989097",
	appId: "1:25233989097:web:937685dc0564f514957f78",
	measurementId: "G-3ZW2C7BJ53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const routes: RouteObject[] = [
	{
		path: "/",
		Component: Root,
		errorElement: <div>Error Occured</div>,
		children: [
			{
				index: true,
				Component: Home
			},
			{
				path: "home",
				Component: HomeRoot,
				children: [
					{
						index: true,
						Component: AppDashboard
					},
					{
						path: "messanger",
						element: <hr />
					},
					{
						path: "sim-service",
						Component: SIMHomeRoot
					},
					{
						path: "id-verification",
						Component: IDVHomeRoot,
						children: [
							{
								index: true,
								Component: IDVHome
							}
						]
					},
					{
						path: "virtual-topup",
						Component: VTUHomeRoot
					},
					{
						path: "payment-gateway",
						element: <hr />
					},
					{
						path: "settings",
						Component: AppSettings
					}
				]
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
				path: "/privacy-policy",
				Component: Privacy
			},
		]
	}
]

function App() {

	useEffect(() => {
		isSupported().then((isSupported) => {
			if (!isSupported)
				console.error("notification is not supported")
		})
		getGoogleAnalyticsClientId(analytics).catch((error) => {
			throw error
		})
	}, [])

	return (
		<AuthProvider>
			<CssVarsProvider defaultMode="dark" disableTransitionOnChange>
				<CssBaseline />
				<RouterProvider router={createBrowserRouter(routes)} />
			</CssVarsProvider>
		</AuthProvider>
	)
}

export default App
