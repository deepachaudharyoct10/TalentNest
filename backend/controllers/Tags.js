const Tag = require("../models/tag");
//create tag
//fetch tag
exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        message: "all fields are requried",
        success: false,
      });
    }

    // create entry in db

    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });

    console.log("create tag is ", tagDetails);

    return res.status(200).json({
      message: "tag is created",
      tagDetails,
      success: true,
    });
  } catch (error) {
    return res.status(503).json({
      message: "error at the time of cosurse createion",
      success: false,
    });
  }
};

exports.getAllTag = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });
    if (!allTags.length) {
      return res.status(404).json({
        success: false,
        message: "No tags found",
      });
    }
    res.status(200).json({
      success: true,
      message: "all tags return successfully",
      allTags,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error in showing all tages",
      success: false,
    });
  }
};
