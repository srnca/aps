import React, { useState } from "react";
import { ITextFieldStyles, mergeStyleSets, TextField } from "@fluentui/react";
import { sha512 } from "js-sha512";
import { IData } from "./table.types";
import { APSContent } from "./apsContent";

const SHA: string = "7f817d64fb3a0b938e6429c387b8f7c644925c39c8dfa8ca04db796e2577cff25b0a593b8534754494c873113aa2a3946503a71b8269c68dd91c89d5bfa11f67";

const classNames = mergeStyleSets({
    wrapper: {
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0
    }
});

const passTextfieldStyles : Partial<ITextFieldStyles> = {
    root: {
        width: '300px',
        borderRadius: '4px'
    }
};

export type APSAppProps = {
    data: IData;
}

export const APSApp: React.FC<APSAppProps> = ({data}) => {

    const [isVerified, setIsVerified] = useState(false);

    const isEqualToSHA = (input: string) => {
        const inputSHA = sha512(input);
        return SHA.localeCompare(inputSHA) === 0
    };

    const _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string | undefined): void => {
        if (text != null && text.trim().length > 0 && isEqualToSHA(text.trim())) {
            setIsVerified(true);
        }
    };

    return (
        <>
            {isVerified 
                ? <APSContent data={data}/>
                : (
                    <div className={classNames.wrapper}>
                        <TextField styles={passTextfieldStyles} placeholder="Zadaj heslo pre vstup" type="password" canRevealPassword onChange={_onChangeText}/>
                    </div>
                )
            }
        </>
    );
};