import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
    try {
        // 1. Vérification du webhook
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        const payload = JSON.stringify(req.body);
        await whook.verify(payload, headers);

        // 2. Extraction des données
        const { data, type } = req.body;

        // Debug: Afficher les données complètes
        console.log("Données complètes reçues:", JSON.stringify(data, null, 2));

        // 3. Préparation des données utilisateur
        const userData = {
            _id: data.id,
            username: data.username || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown',
            email: data.email_addresses?.find(email => email.id === data.primary_email_address_id)?.email_address,
            image: data.image_url || data.profile_image_url,
            role: "user", // Valeur par défaut
            recentSearchedCities: [] // Initialiser le tableau vide
        };

        // 4. Traitement selon le type d'événement
        switch (type) {
            case "user.created":
                const newUser = await User.create(userData);
                console.log("Nouvel utilisateur créé:", newUser);
                break;

            case "user.updated":
                const updatedUser = await User.findByIdAndUpdate(
                    data.id,
                    userData,
                    { new: true, upsert: true }
                );
                console.log("Utilisateur mis à jour:", updatedUser);
                break;

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                console.log("Utilisateur supprimé:", data.id);
                break;

            default:
                console.log(`Événement non géré: ${type}`);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(400).json({
            success: false,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export default clerkWebHooks;