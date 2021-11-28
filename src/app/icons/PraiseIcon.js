import PraiseImg from '../../assets/img/praise.png';
import {Box} from "@mui/material";

export const PraiseIcon = ({size = 24, p = 1}) => (
	<Box component='img' sx={{
		height: size,
		width: size,
		p,
	}} src={PraiseImg} alt={'Praise Icon'}/>
)
