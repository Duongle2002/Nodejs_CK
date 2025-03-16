import Blog from '../models/blog.mjs';

const getBlogPage = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render('blog', {
      blogs,
      user: req.session.user // Truyền biến user vào view
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Error fetching blogs");
  }
};

const getBlogDetail = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.render('blog_detail', {
      blog,
      user: req.session.user // Truyền biến user vào view
    });
  } catch (error) {
    console.error("Error fetching blog details:", error);
    res.status(500).send("Error fetching blog details");
  }
};

export { getBlogPage, getBlogDetail };
