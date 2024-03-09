import './App.css'

import reactLogo from './assets/react.svg'
import Privacy from './pages/Privacy'
import viteLogo from '/vite.svg'

function App() {
	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Techify NG - Privacy Policy</h1>
			<div className="card" style={{ textAlign: "left" }}>
				<p style={{ lineHeight: 1.5 }}>
					<Privacy />
				</p>
			</div>
		</>
	)
}

export default App
