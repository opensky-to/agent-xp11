!macro customHeader

    !system "echo '' > ${BUILD_RESOURCES_DIR}/customHeader"

!macroend

!macro preInit
 
    ; This macro is inserted at the beginning of the NSIS .OnInit callback
 
    !system "echo ''> $ {BUILD_RESOURCES_DIR}/preInit"
 
!macroend



!macro customInit
 
    !system "echo ''> $ {BUILD_RESOURCES_DIR}/customInit"
 
!macroend



!macro customInstall
 
    !system "echo ''> $ {BUILD_RESOURCES_DIR}/customInstall"



    DetailPrint "Register opensky-agent-xp11 URI Handler"
 
    DeleteRegKey HKCR "opensky-agent-xp11"
 
    WriteRegStr HKCR "opensky-agent-xp11" "" "URL: opensky-agent-xp11"
 
    WriteRegStr HKCR "opensky-agent-xp11" "URL Protocol" ""
 
    WriteRegStr HKCR "opensky-agent-xp11" "EveHQ NG SSO authentication Protocol "" "
 
    WriteRegStr HKCR" opensky-agent-xp11\DefaultIcon "" "" $ INSTDIR\$ {APP_EXECUTABLE_FILENAME} "
 
    WriteRegStr HKCR" opensky-agent-xp11\shell "" "" "
 
    WriteRegStr HKCR" opensky-agent-xp11\shell\Open "" "" "
 
    WriteRegStr HKCR "opensky-agent-xp11\shell\Open\command" "" "$ INSTDIR\$ {APP_EXECUTABLE_FILENAME}% 1 " 
!Macroend



!macro customInstallMode
 
    # set $ isForceMachineInstall or $ isForceCurrentInstall
 
    # to enforce one or the other modes.
 
!macroend
