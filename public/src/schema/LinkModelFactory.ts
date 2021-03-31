import TrainerLinkModel from "./models/TrainerLinkModel";

export interface LinkModelFactory {

    newInstance(): TrainerLinkModel;
}
