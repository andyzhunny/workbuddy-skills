Add-Type -AssemblyName DocumentFormat.OpenXml
$path = "E:\Desktop\2025-2026第2学期\项目\肇庆五大文化诗词研究与英译传播项目申报书（新）.docx"
$doc = [DocumentFormat.OpenXml.Packaging.WordprocessingDocument]::Open($path, $false)
$doc.MainDocumentPart.Document.Body.Elements() | ForEach-Object {
    $text = $_.InnerText
    if ($text) { Write-Output $text }
}
$doc.Dispose()
