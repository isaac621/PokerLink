import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

export const GameInfo = ({gameID, gameName, sb})=>{

    const dummy =[{name: 'Game ID', data: gameID}, {name: 'Game Name', data: gameName}, {name: 'Blind', data: `${sb}/${sb*2}`}]

    return(
        <Box sx={Style.container}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 200 }} size="small" aria-label="a dense table">
                    <TableBody>
                        {dummy.map((row, i)=>{
                            return(
                            <TableRow hover
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: 'grey.200'}}
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