import Barcode from 'jsbarcode';
import { convertTZ } from '../../../shared/common';
import { config } from '../../../shared/constants';

interface PalletData {
    id: string;
    store_name: string;
    address: string;
    wrapped_date: string;
    Contents?: string;
}

export const printLabel = (palletData: PalletData): void => {
    const content = `
        <br/><br/><div>${getPalletLabel(palletData)}
        <div><br/><br/><br/><br/></div>${getPalletLabel(palletData)}
        </div>`;
    
    const popup = window.open('', '_blank')!;
    popup.document.write(content);
    setTimeout(() => {
        popup.document.close();
        popup.focus();
        popup.print();
        setTimeout(() => {
            if (navigator.userAgent.toLowerCase().includes("android")) {
                popup.close();
            }
        }, 50);
    }, 50);
};

function textToBase64Barcode(text: string): string {
    const canvas = document.createElement("canvas");
    Barcode(canvas, text, { format: "CODE39", height: 40 });
    return canvas.toDataURL("image/png");
}

export const getPalletLabel = (data: PalletData): string => {
    const _content = data.Contents ? data.Contents : '';
    const _wrappedDate = convertTZ(data.wrapped_date, config.BRISBANE_TIME_ZONE);

    return (`
        <div id="pallet-label">
            <table style='border: 1px solid black; width: 100%;height:40%;border-collapse: collapse;'>

                <tr style='border: 1px solid black'>
                    <td colspan="2" style='border: 1px solid black; vertical-align: top; text-align: center;'>
                        <table style="height: 0px;">
                            <tr>
                                <td>
                                    <label>STORE</label>
                                </td>
                            </tr>
                        </table>
                        <br />
                        <label><h2>${data.store_name}</h2></label>
                    </td>
                    <td rowspan="2" style='border: 1px solid black; vertical-align: top; text-align: center;'>
                        <table style="height: 0px;">
                            <tr>
                                <td>
                                    <label>PALLET ID</label>
                                </td>
                            </tr>
                        </table>
                        <br />
                        <label><h1>${data.id}</h1></label>
                    </td>
                </tr>

                <tr>
                    <td colspan="2" rowspan="2" style='border: 1px solid black; vertical-align: top; text-align: center;'>
                        <table style="height: 0px;">
                            <tr>
                                <td>
                                    <label>DELIVERY ADDRESS</label>
                                </td>
                            </tr>
                        </table>
                        <br />
                        <label><h3>${data.address}</h3></label>
                    </td>
                </tr>

                <tr>
                    <td rowspan="2" style='border: 1px solid black; vertical-align: top; text-align: center;'>
                        <table style="height: 0px;">
                            <tr>
                                <td>
                                    <label>CONTENTS</label>
                                </td>
                            </tr>
                        </table>
                        <br />
                        <label><h3>${_content}</h3></label>
                    </td>
                </tr>

                <tr>
                    <td style='border: 1px solid black; vertical-align: top; text-align: center;'>
                        <table style="height: 0px;">
                            <tr>
                                <td>
                                    <label>PALLET ID</label>
                                </td>
                            </tr>
                        </table>
                        <br />
                        <label><img src='${textToBase64Barcode(data.id)}'/></label>
                    </td>
                    <td style='border: 1px solid black; vertical-align: top; text-align: center;'>
                        <table style="height: 0px;">
                            <tr>
                                <td>
                                    <label>DATE WRAPPED</label>
                                </td>
                            </tr>
                        </table>
                        <br />
                        <label><h3>${_wrappedDate}</h3></label>
                    </td>
                </tr>
            </table>
        </div>`);
};
