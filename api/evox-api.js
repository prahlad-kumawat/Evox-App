export default async function handler(req, res) {
  try {
    const { year, make, model } = req.query;

    const apiKey = process.env.EVOX_API_KEY;

    const vehicleRes = await fetch(
      `https://api.evoximages.com/api/v1/vehicles/?api_key=${apiKey}`
    );
    const vehicleData = await vehicleRes.json();

    const vehicle = vehicleData.data.find(v =>
      v.year == year &&
  v.make.toLowerCase().includes(make.toLowerCase()) &&
  v.model.toLowerCase().includes(model.toLowerCase())
    );

    if (!vehicle) {
      return res.status(200).json({ interior: [], exterior: [] });
    }

    const vifnum = vehicle.vifnum;

    const [interior, exterior] = await Promise.all([
      fetch(`https://api.evoximages.com/api/v1/vehicles/${vifnum}/products/77/855?api_key=${apiKey}`).then(r => r.json()),
      fetch(`https://api.evoximages.com/api/v1/vehicles/${vifnum}/products/70/784?api_key=${apiKey}`).then(r => r.json())
    ]);

    res.status(200).json({
      interior: interior.urls || [],
      exterior: exterior.urls || []
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}