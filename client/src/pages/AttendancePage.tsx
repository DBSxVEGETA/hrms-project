
import { useEffect, useState } from 'react';
import { Edit, MoreVertical, Search, Trash2 } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast"; 

import API from 'axios'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const AttendancePage = () => {
  const [attendances , setAttendances] = useState([]);

  const tasks = [
    "Optimize API response time for user search feature",
    "Refactor authentication middleware for better readability",
    "Fix bug in date formatting on dashboard cards",
    "Implement lazy loading for user profile images",
    "Write unit tests for payment service module",
    "Migrate user settings page to new UI framework",
    "Update Swagger docs for v2 of transaction API",
    "Create Redis caching layer for frequently accessed endpoints",
    "Add logging for error scenarios in file upload service",
    "Resolve CORS issue during local frontend-backend integration"
  ];

  const fetchAttendance = async () => {
    try {
      const res = await API.get("http://localhost:9500/api/attendance", {
        withCredentials: true, // 💥 This sends the cookie with request
      });
      console.log("Fetched Attendaces:", res.data);
      setAttendances(res.data);
    } catch (err: any) {
      console.error("Some issue " + err);
    }
  };

  useEffect(()=>{
    fetchAttendance()
  },[])
  

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await API.put(`http://localhost:9500/api/attendance/${id}`, { status }, {
        withCredentials: true,
      });

      await fetchAttendance();
      toast({ title: "Status updated successfully!" });
    } catch (err: any) {
      toast({
        title: "Failed to update status",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const getStatusForAttendance = (id: string) => {
    const statusObj = attendances.find(item => item._id === id);
    return statusObj ? statusObj.status : '';
  };

  const handleEditAttendance = (id: string) => {
    console.log('Edit attendance:', id);
    // Implement edit functionality
  };


  const handleDeleteAttendance = async (id: string) => {
    console.log('Delete Employee:', id);

    try {
      const res = await API.delete(`http://localhost:9500/api/attendance/${id}`, {
        withCredentials: true,
      });
      await fetchAttendance();
      toast({ title: "Attendance deleted successfully!" });
    } catch (err: any) {
      toast({
        title: "Failed to delete the Attendance",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="relative inline-block">
          <Select>
            <SelectTrigger className="bg-white text-black border-gray-300 w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
              <SelectItem value="Leave">Leave</SelectItem>
              <SelectItem value="Late">Late</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>
      
      <Table className="w-full">
        <TableHeader className="bg-purple-700 text-white rounded-t-lg">
          <TableRow>
            <TableHead className="text-white font-medium text-left py-3 px-4">Employee Name</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Employee EmailId</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Phone</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Department</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Task</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Status</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map((attendance) => (
            <TableRow key={attendance._id} className="hover:bg-gray-50">
              <TableCell className="py-3 px-4 text-gray-800">{attendance.employee?.name}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{attendance.employee?.email}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{attendance.employee?.phone}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{attendance.department}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{attendance.task}</TableCell>
              <TableCell className="py-3 px-4">
                <Select 
                  value={getStatusForAttendance(attendance._id)} 
                  onValueChange={(value) => handleStatusChange(attendance._id, value)}
                >
                  <SelectTrigger className="w-28 h-8 bg-white text-black border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                    <SelectItem value="Leave">Leave</SelectItem>
                    <SelectItem value="Late">Late</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="py-3 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreVertical size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white text-black border-gray-200">
                    <DropdownMenuItem 
                      onClick={() => handleEditAttendance(attendance._id)}
                      className="text-black hover:bg-gray-100 cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteAttendance(attendance._id)}
                      className="text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainLayout>
  );
};

export default AttendancePage;
