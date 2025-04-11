import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, MoreVertical, Search, X } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import API from "axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";

// Mock leaves data
// const leavesData = [
//   {
//     id: '1',
//     name: 'Jane Copper',
//     position: 'Full Time Designer',
//     date: '10/09/24',
//     reason: 'Visiting House',
//     status: 'Approved',
//     docs: '',
//   }
// ];

// Calendar data
const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
const currentMonth = "September, 2024";
const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

type LeaveDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddLeaveDialog = ({ isOpen, onClose }: LeaveDialogProps) => {
  const [employeeName, setEmployee] = useState("");
  const [designation, setDesignation] = useState("");
  const [leaveDate, setLeaveDate] = useState("");
  const [reason, setReason] = useState("");
  const [document, setDocument] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleCreateLeave = async () => {
    try {
      const formData = new FormData();
      formData.append("employee", employeeName);
      formData.append("reason", reason);
      formData.append("startDate", leaveDate);
      formData.append("endDate", leaveDate); // assuming single day leave
      if (document) {
        formData.append("doc", document);
      }

      const user = await API.get(`http://localhost:9500/api/employees/name/${employeeName}`, {
        withCredentials: true,
      });

      // {
      //   "employee": "67f807864cf64d9e55e7f26d",
      //   "reason": "Medical leave due to flu",
      //   "startDate": "2025-04-15",
      //   "endDate": "2025-04-17",
      //   "doc": "medical-report.pdf"
      // }

      const leaveData = {
        employee: user.data._id,
        reason: reason,
        startDate: leaveDate,
        endDate: leaveDate,
        doc: document,
      };

      const res = await API.post(
        "http://localhost:9500/api/leaves",
        { leaveData },
        {
          withCredentials: true,
        }
      );
      // const res = await API.post("http://localhost:9500/api/leaves", formData, {
      //   withCredentials: true,
      // });

      toast({ title: "Leave applied successfully!" });
      onClose(); // Close the modal
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error applying for leave",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="bg-purple-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add New Leave</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Search Employee Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search Employee Name"
                  value={employeeName}
                  onChange={(e) => setEmployee(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Designation<span className="text-red-500">*</span>
              </label>
              <Input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full text-gray-800" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Leave Date<span className="text-red-500">*</span>
              </label>
              <Input type="date" value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} className="w-full text-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Documents</label>
              <div className="flex">
                <Input type="text" value={document?.name || ""} className="w-full rounded-r-none text-gray-800" readOnly />
                <Button asChild className="bg-white border border-l-0 border-gray-300 text-gray-800 rounded-l-none">
                  <label className="cursor-pointer px-4 py-2">
                    Upload
                    <input type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Reason<span className="text-red-500">*</span>
            </label>
            <Input type="text" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full text-gray-800" />
          </div>

          <div className="flex justify-center">
            <Button onClick={handleCreateLeave} className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-12">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
const LogoutDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="bg-purple-700 text-white p-4 rounded-t-lg flex items-center justify-center">
          <h2 className="text-xl font-semibold">Log Out</h2>
        </div>

        <div className="p-6">
          <p className="text-center mb-6 text-gray-800">Are you sure you want to log out?</p>

          <div className="flex justify-center space-x-4">
            <Button onClick={onClose} className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-8 rounded-md">
              Cancel
            </Button>
            <Button className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 py-2 px-8 rounded-md">Logout</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeavesPage = () => {
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [leavesData, setLeavesData] = useState([]);
  const [days, setDays] = useState([]);

  const fetchLeaves = async () => {
    try {
      const res = await API.get("http://localhost:9500/api/leaves", {
        withCredentials: true, // 💥 This sends the cookie with request
      });
      console.log("Fetched Leaves:", res.data);
      setLeavesData(res.data);

      const extractEndDayValues = res.data
        .map((leave) => {
          if (leave.endDate) {
            const date = new Date(leave.endDate);
            return date.getDate(); // Gets day of the month (1 - 31)
          }
          return null;
        })
        .filter((day): day is number => day !== null); // Remove nulls and ensure type

      setDays(extractEndDayValues);

      console.log("extractEndDayValues ", extractEndDayValues);
    } catch (err: any) {
      toast({
        title: "System failure",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  // useEffect(() => {
  //   fetchLeaves();
  // }, []);

  // useEffect(() => {
  //   fetchLeaves();
  // }, [isAddLeaveOpen]);

  useEffect(() => {
    if (!isAddLeaveOpen) fetchLeaves();
  }, [isAddLeaveOpen]);

  const handleDelete = async (id: string) => {
    console.log("delete - ", id);

    try {
      const res = await API.delete(`http://localhost:9500/api/leaves/${id}`, {
        withCredentials: true,
      });
      await fetchLeaves();
      toast({ title: "Candidate deleted successfully!" });
    } catch (err: any) {
      toast({
        title: "Failed to delete the candidate",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex space-x-6">
        <div className="w-3/5">
          <div className="mb-6 flex justify-between items-center">
            <div className="relative inline-block">
              <Select>
                <SelectTrigger className="bg-white text-black border-gray-300 w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input type="text" placeholder="Search" className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500" />
              </div>

              <Button onClick={() => setIsAddLeaveOpen(true)} className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md">
                Add Leave
              </Button>
            </div>
          </div>

          <div className="bg-purple-700 text-white p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold">Applied Leaves</h2>
          </div>

          <Table className="w-full">
            <TableHeader className="bg-purple-700 text-white">
              <TableRow>
                <TableHead className="text-white font-medium text-left py-3 px-4">Name</TableHead>
                <TableHead className="text-white font-medium text-left py-3 px-4">Date</TableHead>
                <TableHead className="text-white font-medium text-left py-3 px-4">Reason</TableHead>
                <TableHead className="text-white font-medium text-left py-3 px-4">Status</TableHead>
                <TableHead className="text-white font-medium text-left py-3 px-4">Docs</TableHead>
                <TableHead className="text-white font-medium text-left py-3 px-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leavesData.map((leave) => (
                <TableRow key={leave._id} className="hover:bg-gray-50">
                  <TableCell className="py-3 px-4">
                    <div>
                      <div className="text-gray-800">{leave.employee?.name}</div>
                      <div className="text-xs text-gray-500">{leave.position}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-800">{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-800">{leave.reason}</TableCell>
                  <TableCell className="py-3 px-4">
                    <Select defaultValue={leave.status}>
                      <SelectTrigger className="w-28 h-8 bg-white text-black border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-black">
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {leave.doc ? (
                      <button className="text-gray-500 hover:text-gray-700">
                        <FileText size={18} />
                      </button>
                    ) : null}
                    {leave.doc ? <p className="text-gray-500 hover:text-gray-700">{leave.doc}</p> : null}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-500 hover:text-gray-700">
                          <MoreVertical size={18} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white text-black border-gray-200">
                        <DropdownMenuItem className="text-black hover:bg-gray-100 cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer" onClick={() => handleDelete(leave._id)}>
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
        </div>

        <div className="w-2/5">
          <div className="bg-purple-700 text-white p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold">Leave Calendar</h2>
          </div>

          <div className="border border-gray-200 rounded-b-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <button className="p-1 hover:bg-gray-100 rounded text-gray-700">
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-semibold text-gray-800">{currentMonth}</h3>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-700">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map((day, index) => (
                <div key={index} className="text-center font-medium py-2 text-gray-800">
                  {day}
                </div>
              ))}

              {calendarDays.map((day) => {
                return (
                  <div
                    key={day}
                    className={`
                        h-8 flex items-center justify-center rounded-md text-sm
                        ${days && days.includes(day) ? "bg-purple-600 text-white-800" : "hover:bg-gray-100 text-gray-800"}
                      `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-purple-700 mb-2">Approved Leaves</h3>
              {leavesData.map((leave) => (
                <div key={leave._id} className="flex justify-between py-2">
                  <div>
                    <div className="text-gray-800">
                      {leave.employee?.name} - {leave.employee?.email}
                    </div>
                    <div className="text-xs text-gray-500">{leave.employee?.department}</div>
                  </div>
                  <div className="text-sm text-gray-800">{new Date(leave.endDate).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddLeaveDialog isOpen={isAddLeaveOpen} onClose={() => setIsAddLeaveOpen(false)} />

      <LogoutDialog isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
    </MainLayout>
  );
};

export default LeavesPage;
