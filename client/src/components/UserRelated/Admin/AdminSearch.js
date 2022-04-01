import { Box, Button, Typography } from "@mui/material"
import { grey } from "@mui/material/colors"
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState } from "react";


// const UserItem = ({user, handleOnClick})=>{
//     return <Button sx={Style.userItem}>
//         <Typography>
//             {user.userName}
//         </Typography>
//     </Button>
// }

const columns = [
    { id: '_id', label: 'ID', minWidth: 50 },
    { id: 'userName', label: 'Name', minWidth: 50 },
    {
      id: 'email',
      label: 'Email',
      minWidth: 50,
      align: 'right',
    },
    {
      id: 'isVerified',
      label: 'isVerified',
      minWidth: 50,
      align: 'right',
      format(value){
          return value ? 'true': 'false'
      }
    },

  ];
  
  
  export  function AdminSearch({users, handleUserOnClick}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  

    return (
      <Paper sx={{ width: '800px', overflow: 'hidden' }}>
        <TableContainer sx={{ minHeight: 400 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users && users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow hover onClick={()=>handleUserOnClick(row._id)} role="checkbox" tabIndex={-1} key={i}>
                        {columns.map((column) => {
                            const value = row[column.id];
                            return (
                            <TableCell key={column.id} align={column.align}>
                                {typeof(value) === 'boolean' ? column.format(value) : value}
                            </TableCell>
                            );
                        })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={users ? users.length : 0}
          rowsPerPage= {6}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    );
  }