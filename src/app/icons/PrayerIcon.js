import PrayerImg from '../../assets/img/prayer.png';
import {Box} from "@mui/material";

export const PrayerIcon = ({size = 24, p = 1}) => (
	<Box component='img' sx={{
		height: size,
		width: size,
		p,
	}} src={PrayerImg} alt={'Prayer Icon'}/>
)
