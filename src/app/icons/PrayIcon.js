import PrayImg from '../../assets/img/pray.png';
import {Box} from "@mui/material";

export const PrayIcon = ({size = 24, p = 1}) => (
	<Box component='img' sx={{
		height: size,
		width: size,
		p,
	}} src={PrayImg} alt={'Pray Icon'}/>
)
