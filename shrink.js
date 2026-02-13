function updateShrink(){const settings=(window.getDiffSettings&&window.getDiffSettings())||{shrinkPer:5};const per=settings.shrinkPer||5;shrink=Math.min(Math.floor(score/per),maxShrink())}
