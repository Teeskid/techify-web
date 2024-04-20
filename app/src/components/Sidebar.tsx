import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import RememberMeOutlinedIcon from '@mui/icons-material/RememberMeOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SettingsInputAntennaOutlinedIcon from '@mui/icons-material/SettingsInputAntennaOutlined';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import SimCardOutlinedIcon from '@mui/icons-material/SimCardOutlined';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import GlobalStyles from '@mui/joy/GlobalStyles';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import LinearProgress from '@mui/joy/LinearProgress';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import * as React from 'react';
import { Link as RouterLink } from "react-router-dom";

import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '../contexts';
import { closeSidebar } from '../utils/drawer';
import ColorSchemeToggle from './ColorSchemeToggle';

function Toggler({
	defaultExpanded = false,
	renderToggle,
	children,
}: {
	defaultExpanded?: boolean;
	children: React.ReactNode;
	renderToggle: (params: {
		open: boolean;
		setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	}) => React.ReactNode;
}) {
	const [open, setOpen] = React.useState(defaultExpanded);
	return (
		<React.Fragment>
			{renderToggle({ open, setOpen })}
			<Box
				sx={{
					display: 'grid',
					gridTemplateRows: open ? '1fr' : '0fr',
					transition: '0.2s ease',
					'& > *': {
						overflow: 'hidden',
					},
				}}
			>
				{children}
			</Box>
		</React.Fragment>
	);
}

type NavListItemProps = {
	link: string,
	name: string,
	icon: React.ReactNode
}

function NavListItem({ link, name, icon, ...rest }: NavListItemProps) {
	return (
		<ListItemButton component={RouterLink} to={link} {...rest}>
			{icon}
			<ListItemContent>
				<Typography level="title-sm">{name}</Typography>
			</ListItemContent>
		</ListItemButton>
	)
}

export default function Sidebar() {
	const { user } = useAuth()
	return (
		<Sheet
			className="Sidebar"
			sx={{
				position: { xs: 'fixed', md: 'sticky' },
				transform: {
					xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
					md: 'none',
				},
				transition: 'transform 0.4s, width 0.4s',
				zIndex: 10000,
				height: '100dvh',
				width: 'var(--Sidebar-width)',
				top: 0,
				p: 2,
				flexShrink: 0,
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				borderRight: '1px solid',
				borderColor: 'divider',
			}}
		>
			<GlobalStyles
				styles={(theme) => ({
					':root': {
						'--Sidebar-width': '220px',
						[theme.breakpoints.up('lg')]: {
							'--Sidebar-width': '240px',
						},
					},
				})}
			/>
			<Box
				className="Sidebar-overlay"
				sx={{
					position: 'fixed',
					zIndex: 9998,
					top: 0,
					left: 0,
					width: '100vw',
					height: '100vh',
					opacity: 'var(--SideNavigation-slideIn)',
					backgroundColor: 'var(--joy-palette-background-backdrop)',
					transition: 'opacity 0.4s',
					transform: {
						xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
						lg: 'translateX(-100%)',
					},
				}}
				onClick={() => closeSidebar()}
			/>
			<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
				<IconButton variant="soft" color="primary" size="sm">
					<BrightnessAutoRoundedIcon />
				</IconButton>
				<Typography level="title-lg">Techify NG</Typography>
				<ColorSchemeToggle sx={{ ml: 'auto' }} />
			</Box>
			<Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="Search" />
			<Box
				sx={{
					minHeight: 0,
					overflow: 'hidden auto',
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
					[`& .${listItemButtonClasses.root}`]: {
						gap: 1.5,
					},
				}}
			>
				<List
					size="sm"
					sx={{
						gap: 1,
						'--List-nestedInsetStart': '30px',
						'--ListItem-radius': (theme: any) => theme.vars.radius.sm,
					}}
				>
					<NavListItem link="/home" name="Dashboard" icon={<DashboardRoundedIcon />} />

					<ListItem nested>
						<Toggler
							renderToggle={({ open, setOpen }) => (
								<ListItemButton onClick={() => setOpen(!open)}>
									<QuestionAnswerRoundedIcon />
									<ListItemContent>
										<Typography level="title-sm">Messanger</Typography>
									</ListItemContent>
									<KeyboardArrowDownIcon
										sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
									/>
								</ListItemButton>
							)}
						>
							<List sx={{ gap: 0.5 }}>
								<ListItem sx={{ mt: 0.5 }}>
									<ListItemButton component="a" href="/home/messanger">Logs</ListItemButton>
								</ListItem>
								<ListItem sx={{ mt: 0.5 }}>
									<ListItemButton component="a" href="/home/messanger">Servers</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton component="a" href="/home/messanger">Connections</ListItemButton>
								</ListItem>
							</List>
						</Toggler>
					</ListItem>

					<ListItem nested>
						<Toggler
							renderToggle={({ open, setOpen }) => (
								<ListItemButton onClick={() => setOpen(!open)}>
									<SimCardOutlinedIcon />
									<ListItemContent>
										<Typography level="title-sm">SIM Service</Typography>
									</ListItemContent>
									<KeyboardArrowDownIcon
										sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
									/>
								</ListItemButton>
							)}
						>
							<List sx={{ gap: 0.5 }}>
								<ListItem sx={{ mt: 0.5 }}>
									<ListItemButton component="a" href="/home/sim-service">Logs</ListItemButton>
								</ListItem>
								<ListItem sx={{ mt: 0.5 }}>
									<ListItemButton component="a" href="/home/sim-service/servers">Servers</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton component="a" href="/home/sim-service/connections">Connections</ListItemButton>
								</ListItem>
							</List>
						</Toggler>
					</ListItem>

					<ListItem nested>
						<Toggler
							defaultExpanded
							renderToggle={({ open, setOpen }) => (
								<ListItemButton onClick={() => setOpen(!open)}>
									<RememberMeOutlinedIcon />
									<ListItemContent>
										<Typography level="title-sm">ID Verification</Typography>
									</ListItemContent>
									<KeyboardArrowDownIcon
										sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
									/>
								</ListItemButton>
							)}
						>
							<List sx={{ gap: 0.5 }}>
								<ListItem sx={{ mt: 0.5 }}>
									<ListItemButton component="a" href="/home/id-verification">Try It</ListItemButton>
								</ListItem>
								<ListItem sx={{ mt: 0.5 }}>
									<ListItemButton component="a" href="/home/id-verification">Servers</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton component="a" href="/home/id-verification">Connections</ListItemButton>
								</ListItem>
							</List>
						</Toggler>
					</ListItem>

					<ListItem nested>
						<Toggler
							renderToggle={({ open, setOpen }) => (
								<ListItemButton onClick={() => setOpen(!open)}>
									<SettingsInputAntennaOutlinedIcon />
									<ListItemContent>
										<Typography level="title-sm">Virtual Top Up</Typography>
									</ListItemContent>
									<KeyboardArrowDownIcon
										sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
									/>
								</ListItemButton>
							)}
						>
							<List sx={{ gap: 0.5 }}>
								<ListItem sx={{ mt: 0.5 }}>
									<ListItemButton component="a" href="/home/virtual-topup">Logs</ListItemButton>
								</ListItem>
								<ListItem sx={{ mt: 0.5 }}>
									<ListItemButton component="a" href="/home/sim-service/servers">Servers</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton component="a" href="/home/sim-service/connections">Connections</ListItemButton>
								</ListItem>
							</List>
						</Toggler>
					</ListItem>

					<ListItem nested>
						<Toggler
							renderToggle={({ open, setOpen }) => (
								<ListItemButton onClick={() => setOpen(!open)}>
									<CurrencyExchangeOutlinedIcon />
									<ListItemContent>
										<Typography level="title-sm">Express Pay</Typography>
									</ListItemContent>
									<KeyboardArrowDownIcon
										sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
									/>
								</ListItemButton>
							)}
						>
							<List sx={{ gap: 0.5 }}>
								<ListItem sx={{ mt: 0.5 }}>
									<ListItemButton component="a" href="/home/sim-service">Logs</ListItemButton>
								</ListItem>
								<ListItem sx={{ mt: 0.5 }}>
									<ListItemButton component="a" href="/home/sim-service/servers">Servers</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton component="a" href="/home/sim-service/connections">Connections</ListItemButton>
								</ListItem>
							</List>
						</Toggler>
					</ListItem>

					<ListItem>
						<ListItemButton
							role="menuitem"
							component="a"
							href="/joy-ui/getting-started/templates/order-dashboard/"
						>
							<ShoppingCartRoundedIcon />
							<ListItemContent>
								<Typography level="title-sm">Transactions</Typography>
							</ListItemContent>
						</ListItemButton>
					</ListItem>

				</List>
				<List
					size="sm"
					sx={{
						mt: 'auto',
						flexGrow: 0,
						'--ListItem-radius': (theme: any) => theme.vars.radius.sm,
						'--List-gap': '8px',
						mb: 2,
					}}>
					<ListItem>
						<ListItemButton
							role="menuitem"
							component="a"
							href="/joy-ui/getting-started/templates/messages/"
						>
							<QuestionAnswerRoundedIcon />
							<ListItemContent>
								<Typography level="title-sm">Messages</Typography>
							</ListItemContent>
							<Chip size="sm" color="primary" variant="solid">
								4
							</Chip>
						</ListItemButton>
					</ListItem>

					<ListItem>
						<ListItemButton
							role="menuitem"
							component="a"
							href="/home/settings"
						>
							<SettingsRoundedIcon />
							<ListItemContent>
								<Typography level="title-sm">Settings</Typography>
							</ListItemContent>
						</ListItemButton>
					</ListItem>

					<ListItem>
						<ListItemButton>
							<SupportRoundedIcon />
							Support
						</ListItemButton>
					</ListItem>
				</List>
				<Card
					invertedColors
					variant="soft"
					color="warning"
					size="sm"
					sx={{ boxShadow: 'none' }}
				>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography level="title-sm">Used space</Typography>
						<IconButton size="sm">
							<CloseRoundedIcon />
						</IconButton>
					</Stack>
					<Typography level="body-xs">
						Your team has used 80% of your available space. Need more?
					</Typography>
					<LinearProgress variant="outlined" value={80} determinate sx={{ my: 1 }} />
					<Button size="sm" variant="solid">
						Upgrade plan
					</Button>
				</Card>
			</Box>
			<Divider />
			<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
				<Avatar
					variant="outlined"
					size="sm"
					src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
				/>
				<Box sx={{ minWidth: 0, flex: 1 }}>
					<Typography level="title-sm">{user?.displayName}.</Typography>
					<Typography level="body-xs">{user?.email}</Typography>
				</Box>
				<IconButton onClick={() => signOut(getAuth())} size="sm" variant="plain" color="neutral">
					<LogoutRoundedIcon />
				</IconButton>
			</Box>
		</Sheet>
	);
}