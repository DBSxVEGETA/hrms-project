import { useState, useEffect } from "react";
import { Edit, MoreVertical, Search, Trash2, X } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import API from "axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type EmployeeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  employee?: any;
};

const EmployeeDialog = ({ isOpen, onClose, isEdit = false, employee = {} }: EmployeeDialogProps) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: employee.name || "",
    email: employee.email || "",
    phone: employee.phone || "",
    department: employee.department || "",
    position: employee.position || "",
    joiningDate: employee.joiningDate,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isEdit && employee._id) {
        const res = await API.put(`http://localhost:9500/api/employees/${employee._id}`, formData, { withCredentials: true });
        toast({ title: "Employee updated successfully!" });
        console.log("Updated employee:", res.data);
      } else {
        const res = await API.post(`http://localhost:9500/api/employees`, formData, { withCredentials: true });
        toast({ title: "Employee added successfully!" });
        console.log("New employee:", res.data);
      }

      onClose(); // close dialog
    } catch (err: any) {
      toast({
        title: isEdit ? "Update failed" : "Creation failed",
        description: err.response?.data?.message || "Something went wrong",
      });
      console.error("Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="bg-purple-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-semibold">{isEdit ? "Edit Employee Details" : "Add New Employee"}</h2>
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
              <Input type="text" name="name" className="w-full" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Email Address<span className="text-red-500">*</span>
              </label>
              <Input type="email" name="email" className="w-full" value={formData.email} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Phone Number<span className="text-red-500">*</span>
              </label>
              <Input type="tel" name="phone" className="w-full" value={formData.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Department<span className="text-red-500">*</span>
              </label>
              <Input type="text" name="department" className="w-full" value={formData.department} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Position<span className="text-red-500">*</span>
              </label>
              <select
                name="position"
                className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={formData.position}
                onChange={handleChange}
              >
                <option value="">Select Position</option>
                <option value="Intern">Intern</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Date of Joining<span className="text-red-500">*</span>
              </label>
              <Input type="date" name="dateJoined" className="w-full" value={formData.joiningDate} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-center">
            <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-12" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeesPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [employeesData, setEmployeeData] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    console.log("fetching employees data...");
    fetchEmployees();
  }, [isAddDialogOpen, isEditDialogOpen]);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("http://localhost:9500/api/employees", {
        withCredentials: true, // 💥 This sends the cookie with request
      });
      console.log("Fetched Candidates:", res.data);
      setEmployeeData(res.data);
    } catch (err: any) {
      toast({
        title: "System failure",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleEditEmployee = (employee: any) => {
    setCurrentEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDeleteEmployee = async (id: string) => {
    console.log("Delete Employee:", id);

    try {
      const res = await API.delete(`http://localhost:9500/api/employees/${id}`, {
        withCredentials: true,
      });
      await fetchEmployees();
      toast({ title: "Employee deleted successfully!" });
    } catch (err: any) {
      toast({
        title: "Failed to delete the Employee",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="relative inline-block">
          <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm leading-tight text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500">
            <option>Position</option>
            <option>Intern</option>
            <option>Junior</option>
            <option>Senior</option>
            <option>Manager</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input type="text" placeholder="Search" className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500" />
        </div>
      </div>

      <Table className="w-full">
        <TableHeader className="bg-purple-700 text-white rounded-t-lg">
          <TableRow>
            <TableHead className="text-white font-medium text-left py-3 px-4">Employee Name</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Email Address</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Phone Number</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Position</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Department</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Date of Joining</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeesData.map((employee) => (
            <TableRow key={employee._id} className="hover:bg-gray-50">
              <TableCell className="py-3 px-4 text-gray-800">{employee.name}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{employee.email}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{employee.phone}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{employee.position}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{employee.department}</TableCell>
              {/* new Date(employee.joiningDate).toISOString().split("T")[0] */}
              <TableCell className="py-3 px-4 text-gray-800">{new Date(employee.joiningDate).toISOString().split("T")[0]}</TableCell>
              <TableCell className="py-3 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreVertical size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-gray-200">
                    <DropdownMenuItem onClick={() => handleEditEmployee(employee)} className="text-black hover:bg-gray-100 cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteEmployee(employee._id)} className="text-red-600 hover:bg-red-50 cursor-pointer">
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

      <EmployeeDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} isEdit={false} />

      <EmployeeDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} isEdit={true} employee={currentEmployee} />
    </MainLayout>
  );
};

export default EmployeesPage;
