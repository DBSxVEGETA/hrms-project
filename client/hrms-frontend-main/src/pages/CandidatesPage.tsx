
import { useState , useEffect } from 'react';
import { Edit, MoreVertical, Search, Trash2, X } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast"; 
import API from "axios";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type CandidateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddCandidateDialog = ({ isOpen, onClose  }: CandidateDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
      setResumeName(e.target.files[0].name);
    }
  };

  const handleCreateCandidate = async () => {
    if (!resumeFile) {
      toast({ title: "Resume is required!" });
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("status", "Pending");
    data.append("resume", resumeFile);

    try {
      await API.post("http://localhost:9500/api/candidates", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({ title: "Candidate created successfully!" });
      onClose();
      setFormData(true);

    } catch (err: any) {
      toast({
        title: "Candidate Creation failed",
        description: err.response?.data?.message || "Something went wrong",
      });

      setFormData(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="bg-purple-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add New Candidate</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Full Name<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Email Address<span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Phone Number<span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Position<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Experience<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Resume<span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <Input
                  type="text"
                  value={resumeName}
                  className="w-full rounded-r-none"
                  readOnly
                />
                <Button
                  className="bg-white border border-l-0 border-gray-300 text-gray-600 rounded-l-none"
                  asChild
                >
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                    <span>Upload</span>
                  </label>
                </Button>
              </div>
            </div>
          </div>

          {/* <div className="mb-6">
            <div className="flex items-center">
              <Checkbox id="declaration" />
              <label htmlFor="declaration" className="ml-2 text-sm text-gray-800">
                I hereby declare that the above information is true to the best of my knowledge and belief
              </label>
            </div>
          </div> */}

          <div className="flex justify-center">
            <Button
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-12"
              onClick={handleCreateCandidate}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidatesPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [candidatesData , setCandidatesData] = useState([]);

  const fetchCandidates = async () => {
    try {
      const res = await API.get("http://localhost:9500/api/candidates", {
        withCredentials: true, // 💥 This sends the cookie with request
      });
      console.log("Fetched Candidates:", res.data);
      setCandidatesData(res.data);
    } catch (err: any) {
      toast({
        title: "System failure",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  useEffect(() => {
    console.log("fetching candidate data...");
    fetchCandidates();
  }, []);

  useEffect(() => {
    console.log("fetching candidate data...");
    fetchCandidates();
  }, [isAddDialogOpen]);


  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await API.put(
        `http://localhost:9500/api/candidates/${id}`,
        { status },
        {
          withCredentials: true,
        }
      );
  
      if (status === "Selected") {
        // ✅ Get current candidate details
        const candidateRes = await API.get(
          `http://localhost:9500/api/candidates/${id}`,
          {
            withCredentials: true,
          }
        );
  
        const currentCandidateData = candidateRes.data;
  
        // ✅ Promote to employee
        const promoteRes = await API.post(
          `http://localhost:9500/api/candidates/promote/${id}`,
          { currentCandidateData },
          {
            withCredentials: true,
          }
        );
  
        const employee = promoteRes.data.employee;
  
        await markAttendance({
          employee: employee, 
          date: new Date().toISOString().split("T")[0],
          status: "Present",
          task: "task - 1",
          position: employee.position || "",
          department: employee.department || ""
        });
      }
  
      await fetchCandidates();
      toast({ title: "Status updated successfully!" });
    } catch (err: any) {
      toast({
        title: "Failed to update status",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };
  
  const markAttendance = async (attendanceData: {
    employee: any;
    date: any;
    status: string;
    task: string;
    position: string;
    department: string;
  }) => {
    try {
      const res = await API.post(
        "http://localhost:9500/api/attendance/",
        attendanceData,
        {
          withCredentials: true, // Include cookies if using session-based auth
        }
      );
  
      console.log("Attendance marked:", res.data);
      toast({ title: "Attendance marked successfully!" });
    } catch (err: any) {
      console.error("Error marking attendance:", err.response?.data || err.message);
      toast({
        title: "Failed to mark attendance",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };
  
  const getStatusForCandidate = (id: string) => {
    const statusObj = candidatesData.find(item => item._id === id);
    return statusObj ? statusObj.status : 'Pending';
  };

  const handleEditCandidate = async (id: string) => {
    console.log('Edit candidate:', id);
    // Implement edit functionality
  };

  const handleDeleteCandidate = async (id: string) => {
    console.log('Delete candidate:', id);

    try {
      const res = await API.delete(`http://localhost:9500/api/candidates/${id}`, {
        withCredentials: true,
      });
      await fetchCandidates();
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
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative inline-block">
            <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm leading-tight text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500">
              <option>Status</option>
              <option>Pending</option>
              <option>Scheduled</option>
              <option>Ongoing</option>
              <option>Selected</option>
              <option>Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <div className="relative inline-block">
            <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm leading-tight text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500">
              <option>Position</option>
              <option>Designer</option>
              <option>Developer</option>
              <option>Manager</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md"
          >
            Add Candidate
          </Button>
        </div>
      </div>
      
      <Table className="w-full">
        <TableHeader className="bg-purple-700 text-white rounded-t-lg">
          <TableRow>
            <TableHead className="text-white font-medium text-left py-3 px-4">Sr no.</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Candidates Name</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Email Address</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Phone Number</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Position</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Status</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Experience</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidatesData.map((candidate) => (
            <TableRow key={candidate._id} className="hover:bg-gray-50">
              <TableCell className="py-3 px-4 text-gray-800">{candidate._id}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{candidate.name}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{candidate.email}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{candidate.phone}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{candidate.position}</TableCell>
              <TableCell className="py-3 px-4">
                <Select 
                  value={getStatusForCandidate(candidate._id)} 
                  onValueChange={(value) => handleStatusChange(candidate._id, value)}
                >
                  <SelectTrigger className="w-[130px] h-8 bg-white text-black border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Selected">Selected</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{candidate.experience} Years</TableCell>
              <TableCell className="py-3 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreVertical size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-gray-200">
                    <DropdownMenuItem 
                      onClick={() => handleEditCandidate(candidate._id)}
                      className="text-black hover:bg-gray-100 cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" /> 
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteCandidate(candidate._id)}
                      className="text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> 
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <AddCandidateDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
      />
    </MainLayout>
  );
};

export default CandidatesPage;
