const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const WhyChooseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const serviceDetailSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    bannerTitle: { type: String, required: true },
    bannerImage: { type: String },
    welcomeText: { type: String, required: true },
    servicesTitle: { type: String, required: true },
    servicesDescription: { type: String, required: true },
    features: { type: [FeatureSchema], default: [] },
    whyChooseTitle: { type: String, required: true },
    whyChooseItems: { type: [WhyChooseSchema], default: [] },
    whyChooseOurTitle: { type: String },
    whyChooseOurItems: { type: [WhyChooseSchema], default: [] },
    typesTitle: { type: String },
    typesItems: { type: [FeatureSchema], default: [] },
    companyWhyTitle: { type: String },
    companyWhyItems: { type: [WhyChooseSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceDetail', serviceDetailSchema);
