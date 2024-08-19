import { IButtonStyles, IRawStyle, IStyle, ITextFieldStyles, IToggleStyles, mergeStyleSets } from "@fluentui/react";

export const useAPSTableStyles = () => {
    const classNames = mergeStyleSets({
        fileIconHeaderIcon: {
          padding: 0,
          fontSize: '16px'
        },
        fileIconCell: {
          textAlign: 'center',
          selectors: {
            '&:before': {
              content: '.',
              display: 'inline-block',
              verticalAlign: 'middle',
              height: '100%',
              width: '0px',
              visibility: 'hidden'
            }
          }
        },
        fileIconImg: {
          verticalAlign: 'middle',
          maxHeight: '16px',
          maxWidth: '16px',
        },
        controlWrapper: {
          display: 'flex',
          flexWrap: 'wrap',
          backgroundColor: '#F3F2F1',
          padding: '0 16px'
        },
        exampleToggle: {
          display: 'inline-block',
          marginBottom: '10px',
          marginRight: '30px'
        },
        selectionDetails: {
          marginBottom: '20px'
        },
    });

    const loadButtonStyles: Partial<IButtonStyles> = {
        root: {
            height: 48,
            width: 48
        },
        icon: {
            width: 20,
            height: 20,
            '& > svg': {
                width: 20,
                height: 20
            }
        }
    };

    const compactToggleStyles: Partial<IToggleStyles> = {
        root: {
            margin: '0 30px 20px 0',
            maxWidth: '300px',
        }
    };

    const filterTextfieldStyles : Partial<ITextFieldStyles> = {
        root: {
            margin: '0px 32px 16px 0px'
        }
    };

    return {
        classNames,
        loadButtonStyles,
        compactToggleStyles,
        filterTextfieldStyles
    };
};