import React, { createContext, useCallback, useEffect, useReducer } from "react"

type User = {}

type Wallet = {}

type ContextProps = {
	initialized: boolean,
	wallet: Wallet,
	user: User,
	setField?(field: string, value: string): void,
	refresh?(): void,
}

const initialState: ContextProps = {
	initialized: false,
	wallet: {} as Wallet,
	user: {} as User,
	setField: () => void 0,
	refresh: () => void 0,
}

const AccountContext = createContext<ContextProps>(initialState)

const ACTION_RESET = 0
const ACTION_SET_USER = 1
const ACTION_SET_WALLET = 2
const ACTION_SET_FIELD = 3

type Action = { type: number, field?: string, value?: any } & Partial<ContextProps>

type UserReducer = React.Reducer<ContextProps, Action>

const userReducer: UserReducer = (state: ContextProps, action: Action): ContextProps => {
	switch (action.type) {
		// USER SET  NULL
		case ACTION_RESET:
			return { initialized: false, wallet: {} as Wallet, user: {} as User }
		// USER SET STATE
		case ACTION_SET_USER:
			const { user } = action
			return { ...state, initialized: true, user: user as User }
		case ACTION_SET_WALLET:
			const { wallet } = action
			return { ...state, initialized: true, wallet: wallet as Wallet }
		// USER SET FIELD
		case ACTION_SET_FIELD:
			const { field, value } = action
			return { ...state, [field as string]: value }
		default:
			return state
	}
}

type ProviderProps = {
	uid: string,
	children?: React.ReactNode
}

export const AccountProvider = ({ uid, children }: ProviderProps): JSX.Element => {
	const [state, dispatch] = useReducer<UserReducer>(userReducer, initialState)

	const refresh = useCallback(() => {
		dispatch({ type: ACTION_RESET })
	}, [dispatch])

	const setField = useCallback((field: string, value: any) => {
		dispatch({ type: ACTION_SET_FIELD, field, value })
	}, [dispatch])

	useEffect(() => {
		if (!uid)
			return
		// user and wallet

		// getUserById(uid, true).then((data) => {
		// 	dispatch({ type: ACTION_SET_USER, user: (data?.user || {}) as User })
		// 	dispatch({ type: ACTION_SET_WALLET, wallet: (data?.wallet || {}) as Wallet })
		// }).catch((error: FirestoreError) => {
		// 	dispatch({ type: ACTION_RESET })
		// 	if (error.code.match('auth/network-request-failed')) {
		// 		MySwal.fire('Error', 'You are not connected to the internet, please check your connection settings and try again.', 'error')
		// 		return
		// 	}
		// 	// throw error
		// 	MySwal.fire('Error', error.message, 'error')
		// })
	}, [uid, dispatch])
	return (
		<AccountContext.Provider
			value={{ ...state, refresh, setField }}>
			{children}
		</AccountContext.Provider>
	)
}

export default AccountContext