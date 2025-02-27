import { Project } from "../modules/project_modules.js";
import ApiError from "../utlis/ApiError.js";
import ApiResponse from "../utlis/ApiResponse.js";

// controller for assing the project
const projectDetails = async (req, res) => {
  try {
    const {
      projectName,
      managerName,
      selectMember,
      startDate,
      endDate,
      description,
    } = req.body;

    // Ensure selectMember is an array of ObjectIds
    const project = new Project({
      projectName,
      managerName,
      selectMember, // This should be an array of ObjectIds (from the frontend)
      startDate,
      endDate,
      description,
    });

    await project.save();

    res.status(200).json({
      message: "Project added successfully!",
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error adding project",
      error: error.message,
    });
  }
};

// controller for delete all project details
// Controller to delete a project by ID
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "id found");
    // Attempt to find and delete the project
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: deletedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params; // Get project ID from request params
    const updatedData = req.body; // Get updated data from request body

    // Ensure selectMember is an array of ObjectIds if it's included in the update
    if (updatedData.selectMember && !Array.isArray(updatedData.selectMember)) {
      return res.status(400).json({
        success: false,
        message: "selectMember should be an array of ObjectIds",
      });
    }

    // Find and update the project
    const updatedProject = await Project.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// count total  project
const getAllProject = async (req, res) => {
  const projectDetails = await Project.find();

  if (!projectDetails) {
    throw new ApiError(401, "Projects does not get");
  }

  // count the total number of registration
  const totalProjects = await projectDetails.length;
  // console.log(totalProjects);

  res.status(200).json(
    new ApiResponse(
      201,
      {
        projectDetails,
        totalProjects,
      },
      "All project details"
    )
  );
};

export { projectDetails, getAllProject, deleteProject };
