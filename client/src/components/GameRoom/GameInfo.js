import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import { useGameContext } from '../ContextProvider/GameContextProvider';

export const GameInfo = ()=>{

    const {sb, roomID, roomName} = useGameContext();

    const gameInfo =[{name: 'Game ID', data: roomID}, {name: 'Game Name', data: roomName}, {name: 'Blind', data: `${sb}/${sb*2}`}]

    return(
        <Box sx={Style.container}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 200 }} size="small" aria-label="a dense table">
                    <TableBody>
                        {gameInfo.map((row, i)=>{
                            return(
                            <TableRow hover
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: 'grey.200'}} key={i}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.data}</TableCell>
                             </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

const Style ={
    container:{
        backgroundColor: 'grey.100',
        borderRadius: 2,
    },
    infoItem: {
        height: 25,
        width: 250,
        
    }

}