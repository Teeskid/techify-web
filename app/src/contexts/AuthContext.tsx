import type { AuthError, ParsedToken, User } from "firebase/auth"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { createContext, useCallback, useEffect, useReducer, type ReactNode, type Reducer } from "react"

type LogInHandler = (user: User) => Promise<void>
type LogOutHandler = () => Promise<void>

enum ActionTypes {
	LOGIN = 0,
	LOGOUT
}

type AuthState = {
	initialized: boolean,
	logged: boolean,
	token: ParsedToken,
	user: User,
	logIn: LogInHandler,
	logOut: LogOutHandler,
}

type AuthAction = { type: ActionTypes.LOGIN, user: User, token: ParsedToken } | { type: ActionTypes.LOGOUT }
type AuthReducer = Reducer<AuthState, AuthAction>

const initialState: AuthState = {
	initialized: false,
	logged: !!localStorage.getItem('isLogged'),
	token: {} as ParsedToken,
	user: {} as User,
	logIn: (user: User) => {
		console.log('YOU NOW LOGGED: ', user.email)
		return Promise.resolve(void 0)
	},
	logOut: () => Promise.resolve(void 0),
}

const AuthContext = createContext<AuthState>(initialState)

const authReducer: AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		// LOGIN
		case ActionTypes.LOGIN:
			const { user, token } = action
			// USER | TOKEN | CACHE
			localStorage.setItem('isLogged', 'true')
			return { ...state, initialized: true, logged: true, user: user, token: token }
		// LOGOUT
		case ActionTypes.LOGOUT:
			localStorage.removeItem('isLogged')
			return { ...state, initialized: false, logged: false, user: {} as User, token: {} as ParsedToken }
		default:
			return state
	}
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer<AuthReducer>(authReducer, initialState)

	const logIn = useCallback<LogInHandler>(async (user: User) => {
		const token = await user.getIdTokenResult(true).catch(() => null)
		if (!token) {
		}
		dispatch({ type: ActionTypes.LOGIN, user, token: (token?.claims || {}) as ParsedToken })
	}, [dispatch])

	const logOut = useCallback<LogOutHandler>(async () => {
		await signOut(getAuth())
		dispatch({ type: ActionTypes.LOGOUT })
	}, [dispatch])

	useEffect(() => {
		const unSubscribe = onAuthStateChanged(getAuth(), async (user: User | null) => {
			try {
				if (user) {
					await logIn(user)
				} else {
					await logOut()
				}
			} catch (error) {
				alert('You are not connected to the internet, please check your connection settings and try again.')
			}
		}, (error: AuthError | unknown) => {
			if ((error as AuthError).code === 'auth/network-request-failed') {
				alert('You are not connected to the internet, please check your connection settings and try again.')
				return
			}
			alert((error as Error).message)
		})
		return () => {
			unSubscribe()
		}
	}, [logIn, logOut])

	return (
		<AuthContext.Provider value={{
			...state,
			logIn,
			logOut
		}}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContext
