


export interface MarkDownColumn {
    name: string;
    width: number;
    align: string;
}

export interface MarkDownTable {
    cols: MarkDownColumn[];
    data: string[][];
}

export class MarkDownDecorator {

    public addNewLine(): string {
        return ("&nbsp;\n");
    }

    public addSeparator(): string {
        return ("--------\n");
    }

    public addH1(buf: string): string {
        return ("# " + buf + "\n");
    }

    public addH2(buf: string): string {
        return ("## " + buf + "\n");
    }

    public addH3(buf: string): string {
        return ("### " + buf + "\n");
    }

    public addTable(table: MarkDownTable): string {
        let buf = "";

        const rows = table.data.length;
        const cols = table.cols.length;

        buf += "|"
        for (let c = 0; c < cols; c++) {
            buf += (table.cols[c].name + "|");

            let width = table.cols[c].width;
            for (let r = 0; r < rows; r++) {
                if (!width || table.data[r][c].length > width) {
                    width = table.data[r][c].length;
                }
            }
        }

        buf += "\n";
        buf += "|";
        for (let c = 0; c < cols; c++) {
            const col = table.cols[c];

            if (col.align === "r" || col.align === "c") {
                buf += ":";
            }

            buf += ("-".repeat(Math.max(5, col.width)));

            if (col.align === "l" || col.align === "c") {
                buf += ":";
            }
            buf += "|";
        }
        buf += "\n";

        for (let r = 0; r < rows; r++) {
            buf += "|";
            for (let c = 0; c < cols; c++) {
                const cell = table.data[r][c];
                buf += (cell + "|")
            }
            buf += "\n";
        }

        return buf;
    }

    public wrapCode(buf: string): string {
        return ("```\n" + buf + "\n```\n");
    }

    public wrapTag(buf: string): string {
        return ("`" + buf + "`");
    }

    public addBold(buf: string): string {
        return ("**" + buf + "**");
    }

    public addItalic(buf: string): string {
        return ("_" + buf + "_");
    }

    public addBullet(buf: string): string {
        return ("- " + buf + "\n");
    }

}