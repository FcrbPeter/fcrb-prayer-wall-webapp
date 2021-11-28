import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Container,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	TextField
} from "@mui/material";
import {useEffect, useState} from "react";
import {addPrayNote, listenPrayNotes} from "./service/firebase";

function App() {
	const [submitNote, setSubmitNote] = useState({
		name: '',
		type: 'pray',
		content: '',
	});
	const [notes, setNotes] = useState([]);

	useEffect(() => {
		const unsubscribe = listenPrayNotes((snapshots) => {
			const n = [];
			snapshots.forEach((doc) => {
				const d = doc.data();
				n.push({
					id: doc.id,
					name: d.name,
					type: d.type,
					content: d.content,
					created: new Date(d.created.seconds * 1000),
				});
			});
			setNotes(n);
		});

		return () => unsubscribe();
	}, [setNotes]);

	const onSubmit = async () => {
		await addPrayNote(submitNote);
		setSubmitNote({
			name: '',
			type: 'pray',
			content: '',
		})
	};

	return (
		<Container fixed sx={{py: 5}}>
			<Box sx={{pb: 3}}>
				<Card sx={{maxWidth: 460}}>
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
							/>
						</div>
						<div>
							<FormControl component="fieldset">
								<FormLabel component="legend">I want to</FormLabel>
								<RadioGroup
									row
									aria-label="I want to"
									name="row-radio-buttons-group"
									value={submitNote.type}
									onChange={(event) => setSubmitNote(Object.assign({}, submitNote, {
										type: event.target.value,
									}))}
								>
									<FormControlLabel value="pray" control={<Radio/>} label="Pray"/>
									<FormControlLabel value="praise" control={<Radio/>} label="Praise"/>
								</RadioGroup>
							</FormControl>
						</div>
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
							/>
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
				<Grid container spacing={2}>
					{
						notes && notes.map((note) => (
							<Grid item key={note.id}>
								<Card>
									<CardContent>
										{JSON.stringify(note)}
									</CardContent>
								</Card>
							</Grid>
						))
					}
				</Grid>
			</div>
		</Container>
	);
}

export default App;
