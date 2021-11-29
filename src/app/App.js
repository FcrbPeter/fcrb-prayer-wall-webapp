import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	FormControl,
	FormControlLabel,
	FormGroup,
	Grow,
	Radio,
	RadioGroup,
	Switch,
	TextField,
	Typography,
	useMediaQuery,
	useTheme
} from "@mui/material";
import {useEffect, useState} from "react";
import {addPrayNote, listenPrayNotes} from "./service/firebase";
import {getCountry} from "./service/geo";
import {PrayIcon} from "./icons/PrayIcon";
import {PraiseIcon} from "./icons/PraiseIcon";

function App() {
	const theme = useTheme();
	const isSixCol = useMediaQuery(theme.breakpoints.up('xl'));
	const isFourCol = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
	const isTwoCol = useMediaQuery(theme.breakpoints.only('md'));

	const [submitNote, setSubmitNote] = useState({
		name: 'Anonymous',
		type: 'prayer',
		content: '',
		country: '',
	});
	const [notes, setNotes] = useState([]);
	const [useCountry, setUserCountry] = useState(false);

	useEffect(() => {
		const unsubscribe = listenPrayNotes((snapshots) => {
			const n = [];
			snapshots.forEach((doc) => {
				const d = doc.data();
				n.push({
					id: doc.id,
					name: d.name ?? 'Anonymous',
					type: d.type ?? 'prayer',
					content: d.content ?? '',
					country: d.country ?? '',
					created: new Date(d.created.seconds * 1000),
				});
			});
			setNotes(n);
		});

		return () => unsubscribe();
	}, [setNotes]);

	const onChangeCountry = async (use) => {
		if (use && !submitNote.country) {
			const country = await getCountry();

			setSubmitNote(Object.assign({}, submitNote, {
				country: country ?? '',
			}));
		}

		setUserCountry(use);
	};

	const onSubmit = async () => {
		if (submitNote.content === '') {
			return;
		}

		await addPrayNote(submitNote);

		setSubmitNote({
			name: submitNote.name ?? 'Anonymous',
			type: 'prayer',
			content: '',
			country: submitNote.country,
		})
	};

	const colNum = isSixCol ? 6 : isFourCol ? 4 : isTwoCol ? 2 : 1;

	const cols = [];
	for (let i = 0; i < colNum; i++) {
		cols.push([]);
	}
	for (let i = 0; i < notes.length; i++) {
		cols[i % colNum].push(notes[i]);
	}

	return (
		<Box sx={{p: 5}}>
			<Box sx={{pb: 3, m: 1}}>
				<Card sx={{maxWidth: 460}}>
					<Box sx={{
						width: '100%',
						height: '0.4rem',
						background: '#3265FF'
					}}/>
					<CardContent>
						<div>
							<TextField
								id="standard-basic"
								label="My name is"
								variant="standard"
								value={submitNote.name}
								onChange={(event) => setSubmitNote(Object.assign({}, submitNote, {
									name: event.target.value,
								}))}
								fullWidth
							/>
						</div>
						<Box sx={{py: 1}}>
							<FormControl component="fieldset">
								<RadioGroup
									row
									aria-label="I want to"
									name="row-radio-buttons-group"
									value={submitNote.type}
									onChange={(event) => setSubmitNote(Object.assign({}, submitNote, {
										type: event.target.value,
									}))}
								>
									<FormControlLabel value="prayer" control={<Radio/>} label="Prayer"/>
									<FormControlLabel value="praise" control={<Radio/>} label="Praise"/>
								</RadioGroup>
							</FormControl>
						</Box>
						<div>
							<TextField
								id="outlined-multiline-static"
								label="Multiline"
								multiline
								rows={4}
								value={submitNote.content}
								onChange={(event) => setSubmitNote(Object.assign({}, submitNote, {
									content: event.target.value,
								}))}
								fullWidth
							/>
						</div>
						<div>
							<FormGroup>
								<FormControlLabel control={<Switch
									value={useCountry}
									onChange={(event) => onChangeCountry(event.target.checked)}
								/>} label={useCountry && submitNote.country ? submitNote.country : 'Show my country'}/>
							</FormGroup>
						</div>
					</CardContent>
					<CardActions>
						<Button fullWidth onClick={() => onSubmit()}>
							Submit
						</Button>
					</CardActions>
				</Card>
			</Box>
			<div>
				<Box sx={{display: 'flex', flexWrap: 'wrap'}}>
					{
						cols.map((row) => (
							<Box sx={{
								flex: (100.0 / colNum) + '%',
								maxWidth: (100.0 / colNum) + '%',
							}}>
								{row.map((note) => (
									<Grow in={true} timeout={800}>
										<Card sx={{
											minHeight: 120,
											verticalAlign: 'middle',
											mt: 3,
											mx: 1,
										}}>
											<Box sx={{
												width: '100%',
												height: '0.4rem',
												background: '#3265FF'
											}}/>
											<CardContent>
												<Typography variant={'h6'} component={'div'} sx={{pb: 1}}>
													{note.name}

													{note.country && (
														<Typography color={'text.secondary'} variant={'caption'} component={'span'} sx={{pl: 1}}>
															{note.country}
														</Typography>
													)}

													<Box sx={{float: 'right'}}>
														{note.type === 'prayer' && <PrayIcon/>}
														{note.type === 'praise' && <PraiseIcon/>}
													</Box>
												</Typography>
												<Typography variant={'body1'} component={'p'}>
													{note.content}
												</Typography>
											</CardContent>
										</Card>
									</Grow>
								))}
							</Box>
						))
					}
				</Box>
			</div>
		</Box>
	);
}

export default App;
