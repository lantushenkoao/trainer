export default interface MxPanelCell {
    value: string;
    styles: {
        [key: string]: string
    };
    width: number;
    height: number;
}