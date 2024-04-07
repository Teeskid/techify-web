import { Button, Container, FormControl, FormLabel, Input, Option, Select, Sheet, Stack } from "@mui/joy";
import React, { useCallback, useState } from "react";
import IDVApi from "../../../modules/IDVApi";

const PROVIDER_DATA = [
	{
		id: "nin",
		name: "NIMC (NIGERIA)",
		params: [
			{
				id: "nin",
				name: "NIN Number"
			},
			{
				id: "vnin",
				name: "VNIN Number"
			},
			{
				id: "phone",
				name: "Phone Number"
			},
			{
				id: "demo",
				name: "Demographic Data"
			},
		],
		formats: [
			{
				id: "details",
				name: "RAW Details"
			},
			{
				id: "normal",
				name: "Normal Slip"
			},
			{
				id: "standard",
				name: "Standard Slip"
			},
			{
				id: "premium",
				name: "Premium Slip"
			}
		]
	},
	{
		id: "bvn",
		name: "NIBSS (NIGERIA)",
		params: [
			{
				id: "demo",
				name: "Demographic Data"
			},
			{
				id: "phone",
				name: "Phone Number"
			}
		],
		formats: [
			{
				id: "details",
				name: "RAW Details"
			},
			{
				id: "normal",
				name: "Normal Slip"
			}
		]
	}
]

type NINViewProps = {
	src: string
}

export const NINView: React.FC<NINViewProps> = ({ src }) => {
	return (
		<iframe src={src} allowFullScreen={true} lang="en" />
	)
}

export default function IDVHome(): React.ReactNode {
	const [actionType, setActionType] = useState<number>(-1)
	const [paramType, setParamType] = useState<number>(-1)
	const [paramValue, setParamValue] = useState<string>("")
	const [viewFormat, setViewFormat] = useState<number>(-1)
	const [viewSource, setViewSource] = useState<string>("")

	const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const a = PROVIDER_DATA[actionType].id
		const b = PROVIDER_DATA[actionType].params[paramType].id
		const c = PROVIDER_DATA[actionType].formats[viewFormat].id
		// fork the api backend
		IDVApi.get().verify(a, b, c, paramValue).then(({ code, text, data }) => {
			if (code === 200)
				setViewSource(data)
			else {
				setViewSource(`ERROR VIEW: ${text}`)
			}
		}).catch((err) => {
			console.error(err)
			alert(err)
		})
	}, [actionType, paramType, paramValue, viewFormat])

	return (
		<>
			<Container maxWidth="sm">
				<Sheet sx={{ mx: 3, zIndex: 2 }}>
					<form onSubmit={onSubmit} method="POST">
						<Stack gap={2}>
							<FormControl required>
								<FormLabel>Select Verification Provider</FormLabel>
								<Select name="actionType" value={String(actionType)} onChange={(e, value) => {
									e?.preventDefault()
									setActionType(Number.parseInt(value as string))
								}}>
									<Option value="-1">-- SELECT --</Option>
									{PROVIDER_DATA.map(({ id, name }, index) => (
										<Option key={id} value={`${index}`}>{name}</Option>
									))}
								</Select>
							</FormControl>
							<FormControl required>
								<FormLabel>Select Verification Type</FormLabel>
								<Select name="paramType" value={String(paramType)} onChange={(e, value) => {
									e?.preventDefault()
									setParamType(Number.parseInt(value as string))
								}}>
									<Option value="-1">-- SELECT --</Option>
									{actionType !== -1 && PROVIDER_DATA[actionType]?.params?.map(({ id, name }, index) => (
										<Option key={id} value={`${index}`}>{name}</Option>
									))}
								</Select>
							</FormControl>
							<FormControl required>
								<FormLabel>Select View Format</FormLabel>
								<Select name="viewFormat" value={String(viewFormat)} onChange={(e, value) => {
									e?.preventDefault()
									setViewFormat(Number.parseInt(value as string))
								}}>
									<Option value="-1">-- SELECT --</Option>
									{actionType !== -1 && PROVIDER_DATA[actionType]?.formats?.map(({ id, name }, index) => (
										<Option key={id} value={`${index}`}>{name}</Option>
									))}
								</Select>
							</FormControl>
							<FormControl required>
								<FormLabel>Search Parameter</FormLabel>
								<Input type="text" name="paramValue" value={paramValue} onChange={(e) => {
									setParamValue(e.currentTarget.value as string)
								}} />
							</FormControl>
						</Stack>
						<Stack gap={4} sx={{ mt: 2 }}>
							<Button type="submit" fullWidth>
								Start Verification
							</Button>
						</Stack>
					</form>
				</Sheet>
			</Container>
			<Container maxWidth="lg">
				<Sheet variant="outlined" sx={{ p: 1, mt: 3 }}>
					<iframe srcDoc={viewSource} style={{ width: "100%", "height": "300px" }} />
				</Sheet>
			</Container>
		</>
	)
}
