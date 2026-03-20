(function () {

    const to_fill = jsDesign.command == "to-fill"
    const to_center = jsDesign.command == "to-center"

    for (const node of jsDesign.currentPage.selection) {

        if (!node.layoutGrids || node.layoutGrids.length == 0)
            continue;

        if (!node.children || node.children.length == 0)
            continue;

        let column_count = 0;
        let row_count = 0;

        for (const layout of node.layoutGrids) {
            if (layout.pattern == "COLUMNS") {
                column_count = layout.count
            }
            else if (layout.pattern == "ROWS") {
                row_count = layout.count
            }
        }

        if (column_count == 0 && row_count == 0) {
            return
        }

        node.layoutMode = 'NONE'

        for (const layout of node.layoutGrids) {

            if (layout.pattern == "COLUMNS") {
                let offset_x = layout.offset;

                let index = 0;

                const block_size = layout.alignment == "STRETCH" ? (node.width - (layout.offset * 2) - ((layout.count - 1) * layout.gutterSize)) / layout.count : layout.sectionSize;

                for (const child of [...node.children].reverse()) {

                    let width = 0;
                    let height = 0;

                    let offset_recoup = 0;

                    if (to_fill) {
                        width = block_size;
                        height = child.height

                        if (row_count == 0) {
                            height = node.height;
                            child.y = 0;
                        }

                    } else if (to_center) {
                        width = child.width;
                        height = child.height;

                        offset_recoup = (block_size - child.width) / 2;

                        if (row_count == 0) {
                            height = child.height;
                            child.y = (node.height - child.height) / 2;;
                        }
                    }

                    child.x = offset_x + offset_recoup;
                    child.resize(width, height)

                    offset_x += width + layout.gutterSize + offset_recoup * 2
                    index++;

                    if (index >= layout.count) {
                        index = 0;
                        offset_x = layout.offset;
                    }
                }
            }
            else if (layout.pattern == "ROWS") {
                let offset_y = layout.offset;

                let index = 0;

                const block_size = layout.alignment == "STRETCH" ? (node.height - (layout.offset * 2) - ((layout.count - 1) * layout.gutterSize)) / layout.count : layout.sectionSize;

                for (const child of [...node.children].reverse()) {

                    let width = 0;
                    let height = 0;

                    let offset_recoup = 0;

                    if (to_fill) {
                        height = block_size
                        width = child.width;

                        if (column_count == 0) {
                            width = node.width;
                            child.x = 0;
                        }
                    } else if (to_center) {
                        width = child.width;
                        height = child.height;

                        offset_recoup = (block_size - child.height) / 2;

                        if (column_count == 0) {
                            width = child.width;
                            child.x = (node.width - child.width) / 2;;
                        }
                    }

                    child.y = offset_y + offset_recoup;
                    child.resize(width, height)

                    index++;

                    if (index >= column_count) {
                        offset_y += height + layout.gutterSize + offset_recoup * 2
                        index = 0;
                    }
                }
            }
        }
    }

    jsDesign.closePlugin()
}())