import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Initialize Supabase with Service Role Key for Admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Admin Authentication Middleware (Simple)
const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
  
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

// API Routes
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = Buffer.from(`${username}:${password}`).toString("base64");
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api/admin/appointments", authenticateAdmin, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.patch("/api/admin/appointments/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data, error } = await supabaseAdmin
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Generic Admin CRUD Helper
const createAdminRoutes = (tableName: string) => {
  app.get(`/api/admin/${tableName}`, authenticateAdmin, async (req, res) => {
    const { data, error } = await supabaseAdmin.from(tableName).select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post(`/api/admin/${tableName}`, authenticateAdmin, async (req, res) => {
    const { data, error } = await supabaseAdmin.from(tableName).insert(req.body).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  app.patch(`/api/admin/${tableName}/:id`, authenticateAdmin, async (req, res) => {
    const { data, error } = await supabaseAdmin.from(tableName).update(req.body).eq("id", req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  app.delete(`/api/admin/${tableName}/:id`, authenticateAdmin, async (req, res) => {
    const { error } = await supabaseAdmin.from(tableName).delete().eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });
};

createAdminRoutes("services");
createAdminRoutes("offers");
createAdminRoutes("gallery");
createAdminRoutes("reviews");

app.post("/api/admin/upload", authenticateAdmin, async (req, res) => {
  // Simple base64 upload for demo purposes in this environment
  const { name, type, data } = req.body;
  const buffer = Buffer.from(data, 'base64');

  const { data: uploadData, error } = await supabaseAdmin.storage
    .from('gallery-images')
    .upload(`${Date.now()}-${name}`, buffer, {
      contentType: type,
      upsert: true
    });

  if (error) return res.status(500).json({ error: error.message });

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('gallery-images')
    .getPublicUrl(uploadData.path);

  res.json({ url: publicUrl });
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
