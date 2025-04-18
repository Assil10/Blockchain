const db = require("../db");

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM projects ORDER BY created_at DESC");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching projects");
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("SELECT * FROM projects WHERE id = ?", [id]);
    if (result.length === 0) return res.status(404).send("Project not found");
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching project");
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  const { name, goal_amount } = req.body;

  // Validate required fields
  if (!name || !goal_amount) {
    return res.status(400).send("Missing required fields: name or goal_amount");
  }

  try {
    const [result] = await db.query(
      "INSERT INTO projects (name, goal_amount) VALUES (?, ?)",
      [name, goal_amount]
    );

    // Get the inserted project's ID
    const projectId = result.insertId;

    // Optionally, fetch the project details after inserting
    const [newProject] = await db.query("SELECT * FROM projects WHERE id = ?", [projectId]);

    res.status(201).json(newProject[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating project");
  }
};
// Update an existing project
exports.updateProject = async (req, res) => {
  const { id } = req.params; // Project ID to update
  const { goal_amount, status, description } = req.body; // Fields to update

  // Validate incoming data (ensure at least one field is provided)
  if (!goal_amount && !status && !description) {
    return res.status(400).send("At least one of goal_amount, status, or description is required.");
  }

  try {
    // Prepare the fields to be updated
    const fieldsToUpdate = [];
    const values = [];

    if (goal_amount) {
      fieldsToUpdate.push("goal_amount = ?");
      values.push(goal_amount);
    }

    if (status) {
      fieldsToUpdate.push("status = ?");
      values.push(status);
    }

    if (description) {
      fieldsToUpdate.push("description = ?");
      values.push(description);
    }

    // Update the project in the database
    const [result] = await db.query(
      `UPDATE projects SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) return res.status(404).send("Project not found");

    // Optionally, fetch the updated project details
    const [updatedProject] = await db.query("SELECT * FROM projects WHERE id = ?", [id]);

    res.json(updatedProject[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating project");
  }
};


// Delete a project
exports.deleteProject = async (req, res) => {
  const { id } = req.params;  // Project ID to delete

  try {
    // Step 1: Check if the project exists
    const [project] = await db.query("SELECT * FROM projects WHERE id = ?", [id]);

    if (!project.length) {
      return res.status(404).send("Project not found");
    }

    // Step 2: Delete the project from the database
    await db.query("DELETE FROM projects WHERE id = ?", [id]);

    // Step 3: Respond with a success message
    res.status(200).send({ message: "Project deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting project");
  }
};
