import { Box, Button, FormControl, FormLabel, Grid, Input, Option, Select, Sheet, Stack, Typography } from "@mui/joy";
import React, { useCallback, useState } from "react";
import Swal from "sweetalert2";

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
		Swal.fire({
			title: "Verifying...",
			text: "Please wait while your request is being processed",
			allowEnterKey: false,
			allowEscapeKey: false,
			allowOutsideClick: false,
			didOpen: () => {
				Swal.showLoading()
			},
			customClass: {
				htmlContainer: "z-5"
			}
		})
		const a = PROVIDER_DATA[actionType].id
		const b = PROVIDER_DATA[actionType].params[paramType].id
		const c = PROVIDER_DATA[actionType].formats[viewFormat].id
		// fork the api backend
		IDVApi.get().verify(a, b, paramValue).then(({ code, text, data }) => {
			if (code === 200) {
				Swal.fire("Done", "Request has been processed successfully", "success")
				setViewSource(IDVApi.buildViewLink(data.transactionId, c))
			} else {
				Swal.fire("Done", text, "info")
				setViewSource("")
			}
		}).catch((err) => {
			console.error(err)
			Swal.fire("Error !", err.message, "error")
		}).finally(() => {
			setTimeout(Swal.close, 3000)
		})
	}, [actionType, paramType, paramValue, viewFormat])

	return (
		<Grid component={"div"} container spacing={3} mx={1}>
			<Grid component={"div"} sm={12} md={5} lg={4}>
				<Box component={"form"} onSubmit={onSubmit} method="POST">
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
				</Box>
			</Grid>
			<Grid component={"div"} sm={12} md={7} lg={8}>
				<Sheet variant="outlined">
					{viewSource !== "" ? (
						<iframe src={viewSource} style={{ width: "100%", "height": "300px" }} />
					) : (
						<Typography variant="solid" sx={{ textAlign: "center", p: 3 }}>No Data To Display</Typography>
					)}
				</Sheet>
			</Grid>
		</Grid>
	)
}
